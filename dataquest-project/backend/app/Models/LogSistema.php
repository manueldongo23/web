<?php
class LogSistema {
    public static function registrar($tipo, $mensaje, $userId = null) {
        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO logs_sistema (tipo, mensaje, user_id) VALUES (?, ?, ?)");
        $stmt->execute([$tipo, $mensaje, $userId]);
    }
}