window.Validador = {
    attributes: ['id_est', 'nombre', 'ciudad'],
    fds: [],

    async render(container) {
        this.renderLayout(container);
    },

    renderLayout(container) {
        container.innerHTML = `
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Left Column: Form -->
                <div class="flex-1 space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div class="flex items-center gap-3 mb-6">
                            <i class="fas fa-wrench text-gray-400"></i>
                            <h2 class="text-xl font-bold text-gray-800">Motor de Normalización</h2>
                        </div>
                        <p class="text-sm text-gray-500 mb-6">Define un esquema relacional y analiza su nivel de normalización</p>

                        <!-- Table Name -->
                        <div class="mb-6">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Nombre de la Tabla</label>
                            <input type="text" value="Estudiante" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition">
                        </div>

                        <!-- Attributes -->
                        <div class="mb-6">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Atributos</label>
                            <div id="attrList" class="flex flex-wrap gap-2 mb-3">
                                ${this.attributes.map(attr => `
                                    <div class="bg-indigo-50 text-brand-purple px-3 py-1.5 rounded-lg text-sm font-mono flex items-center gap-2 border border-indigo-100 group">
                                        ${attr}
                                        <button onclick="Validador.removeAttr('${attr}')" class="text-indigo-300 hover:text-red-500 transition">×</button>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="flex gap-2">
                                <input id="newAttr" type="text" placeholder="Nombre del atributo" class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple transition">
                                <button onclick="Validador.addAttr()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                                    <i class="fas fa-plus"></i> Agregar
                                </button>
                            </div>
                        </div>

                        <!-- FDs -->
                        <div class="mb-8">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Dependencias Funcionales</label>
                            <div id="fdList" class="space-y-2 mb-4">
                                ${this.fds.length === 0 ? '<p class="text-xs text-gray-400 italic">Sin dependencias definidas</p>' : ''}
                                ${this.fds.map((fd, i) => `
                                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                        <div class="font-mono text-sm text-gray-600">${fd.det} → ${fd.dep}</div>
                                        <button onclick="Validador.removeFD(${i})" class="ml-auto text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                            <i class="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="flex flex-col md:flex-row gap-3">
                                <input id="fdDet" type="text" placeholder="Determinante (ej: id_est)" class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple transition font-mono">
                                <input id="fdDep" type="text" placeholder="Dependiente (ej: nombre,apellido)" class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple transition font-mono">
                            </div>
                            <button onclick="Validador.addFD()" class="w-full mt-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                                <i class="fas fa-plus"></i> Agregar Dependencia
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Status & Action -->
                <div class="w-full lg:w-96 space-y-6">
                    <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-lightbulb text-amber-400 mt-1"></i>
                            <p class="text-xs text-indigo-900 leading-relaxed font-medium">Define los atributos y dependencias funcionales, luego haz clic en Validar para diagnosticar tu esquema.</p>
                        </div>
                    </div>

                    <button id="btnValidar" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition">
                        ✓ Validar Normalización
                    </button>

                    <div class="bg-white rounded-2xl border border-gray-100 p-6">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="w-8 h-8 bg-pink-100 text-pink-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <h3 class="font-bold text-gray-800">Misión Actual</h3>
                        </div>
                        <p class="text-xs text-gray-500 leading-relaxed mb-4">Alcanza BCNF para liberar los datos de anomalías.</p>
                        <div id="validationResult" class="hidden animate-in fade-in slide-in-from-top-4"></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btnValidar').onclick = () => this.validate();
    },

    addAttr() {
        const input = document.getElementById('newAttr');
        const val = input.value.trim();
        if (val && !this.attributes.includes(val)) {
            this.attributes.push(val);
            this.renderLayout(document.getElementById('contentContainer'));
        }
        input.value = '';
    },

    removeAttr(attr) {
        this.attributes = this.attributes.filter(a => a !== attr);
        this.renderLayout(document.getElementById('contentContainer'));
    },

    addFD() {
        const det = document.getElementById('fdDet').value.trim();
        const dep = document.getElementById('fdDep').value.trim();
        if (det && dep) {
            this.fds.push({ det, dep });
            this.renderLayout(document.getElementById('contentContainer'));
        }
    },

    removeFD(index) {
        this.fds.splice(index, 1);
        this.renderLayout(document.getElementById('contentContainer'));
    },

    async validate() {
        const resultDiv = document.getElementById('validationResult');
        const fdText = this.fds.map(fd => `${fd.det}→${fd.dep}`).join(', ');
        const attrs = this.attributes.join(', ');
        
        try {
            const res = await API.post('validation/normalform', { attrs, fdText });
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `
                <div class="mt-4 p-4 rounded-xl ${res.normalForm.includes('3FN') || res.normalForm.includes('BCNF') ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}">
                    <p class="text-xs font-bold text-gray-700 mb-1">Nivel detectado:</p>
                    <p class="text-xl font-black ${res.normalForm.includes('3FN') || res.normalForm.includes('BCNF') ? 'text-emerald-600' : 'text-amber-600'}">${res.normalForm}</p>
                    <p class="text-[10px] text-gray-500 mt-2">Sugerencia: Revisa las dependencias transitivas.</p>
                </div>
            `;
        } catch (e) {
            alert(e.message);
        }
    }
};