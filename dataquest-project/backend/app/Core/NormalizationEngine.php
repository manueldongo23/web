<?php
class NormalizationEngine {
    public static function computeClosure($attrsSet, $fds, $allAttrs) {
        $closure = array_flip($attrsSet);
        $changed = true;
        while ($changed) {
            $changed = false;
            foreach ($fds as $fd) {
                $lhsOk = true;
                foreach ($fd['lhs'] as $l) if (!isset($closure[$l])) { $lhsOk = false; break; }
                if ($lhsOk) {
                    foreach ($fd['rhs'] as $r) {
                        if (!isset($closure[$r])) {
                            $closure[$r] = true;
                            $changed = true;
                        }
                    }
                }
            }
        }
        return array_keys($closure);
    }

    public static function findCandidateKeys($allAttrs, $fds) {
        $attrsList = array_map('trim', $allAttrs);
        $keys = [];
        $minLen = INF;
        $subsets = function($arr, $start, $current) use (&$subsets, &$keys, &$minLen, $fds, $attrsList) {
            if (!empty($current)) {
                $closure = self::computeClosure($current, $fds, $attrsList);
                if (count(array_diff($attrsList, $closure)) == 0) {
                    if (count($current) < $minLen) {
                        $minLen = count($current);
                        $keys = [$current];
                    } elseif (count($current) == $minLen) {
                        $keys[] = $current;
                    }
                    return;
                }
            }
            for ($i = $start; $i < count($arr); $i++) {
                $current[] = $arr[$i];
                $subsets($arr, $i+1, $current);
                array_pop($current);
            }
        };
        $subsets($attrsList, 0, []);
        return $keys;
    }

    public static function getNormalForm($allAttrs, $fds) {
        $keys = self::findCandidateKeys($allAttrs, $fds);
        if (empty($keys)) return "1FN";
        $prime = [];
        foreach ($keys as $k) foreach ($k as $a) $prime[$a] = true;
        $is2FN = $is3FN = $isBCNF = true;
        foreach ($fds as $fd) {
            $lhs = $fd['lhs'];
            $rhs = $fd['rhs'];
            $closureX = self::computeClosure($lhs, $fds, $allAttrs);
            $isSuperkey = count(array_diff($allAttrs, $closureX)) == 0;
            // 2FN
            foreach ($keys as $key) {
                if (count($lhs) < count($key) && !array_diff($lhs, $key)) {
                    foreach ($rhs as $r) if (!isset($prime[$r])) $is2FN = false;
                }
            }
            // 3FN
            if (!$isSuperkey) {
                foreach ($rhs as $r) if (!isset($prime[$r])) $is3FN = false;
            }
            // BCNF
            if (!$isSuperkey) $isBCNF = false;
        }
        if ($isBCNF) return "BCNF";
        if ($is3FN) return "3FN";
        if ($is2FN) return "2FN";
        return "1FN";
    }

    public static function parseFDs($text) {
        $parts = explode(',', $text);
        $fds = [];
        foreach ($parts as $part) {
            $part = trim($part);
            if (strpos($part, '→') !== false) $arrow = '→';
            elseif (strpos($part, '->') !== false) $arrow = '->';
            else continue;
            list($l, $r) = explode($arrow, $part);
            $lhs = array_map('trim', explode(',', $l));
            $rhs = array_map('trim', explode(',', $r));
            $fds[] = ['lhs' => $lhs, 'rhs' => $rhs];
        }
        return $fds;
    }
}