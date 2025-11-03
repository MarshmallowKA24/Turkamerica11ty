// =====================================================
// TOPICS PANEL JAVASCRIPT
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById('topicsPanel');
    const panelToggle = document.getElementById('panelToggle');
    const searchInput = document.getElementById('topicSearch');
    const topicsList = document.querySelector('.topics-list');
    
    // Toggle panel
    if (panelToggle) {
        panelToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
        });
        
        // También toggle al hacer click en el header
        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.addEventListener('click', function() {
                panel.classList.toggle('collapsed');
            });
        }
    }
    
    // Búsqueda de temas
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const topicItems = document.querySelectorAll('.topic-item');
            
            topicItems.forEach(item => {
                const topicText = item.textContent.toLowerCase();
                if (topicText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }
    
    // Click en topic item abre la explicación
    const topicItems = document.querySelectorAll('.topic-item');
    topicItems.forEach(item => {
        item.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            if (topic && typeof openExplanation === 'function') {
                openExplanation(topic);
            }
        });
    });
});

// =====================================================
// MODAL AND EXPLANATIONS
// =====================================================

// Función para abrir explicaciones
function openExplanation(topic) {
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    const explanations = {
        'imperativo': {
            title: 'Modo Imperativo (Emir Kipi)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>El modo imperativo se usa para dar <strong>órdenes, comandos o instrucciones</strong>. No se usa para "yo" (ben) ni "nosotros" (biz) porque no puedes ordenarte a ti mismo.</p>
                
                <h4>Formación básica</h4>
                <p><strong>Raíz del verbo</strong> + <strong>sufijo imperativo</strong></p>
                
                <h4>Conjugación completa</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Sufijo</th>
                        <th>Ejemplo: gelmek (venir)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben (yo)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td>Sen (tú)</td>
                        <td>Ø (nada)</td>
                        <td><strong>gel</strong></td>
                        <td>¡ven!</td>
                    </tr>
                    <tr>
                        <td>O (él/ella)</td>
                        <td>-sin / -sın</td>
                        <td><strong>gelsin</strong></td>
                        <td>que venga</td>
                    </tr>
                    <tr>
                        <td>Biz (nosotros)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td>Siz (ustedes/formal)</td>
                        <td>-in / -ın / -un / -ün</td>
                        <td><strong>gelin</strong></td>
                        <td>¡vengan! / ¡venga!</td>
                    </tr>
                    <tr>
                        <td>Onlar (ellos)</td>
                        <td>-sin(ler) / -sın(lar)</td>
                        <td><strong>gelsinler</strong></td>
                        <td>que vengan</td>
                    </tr>
                </table>
                
                <h4>Formas negativas</h4>
                <p>Se añade <strong>-me/-ma</strong> antes del sufijo imperativo:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Persona</th>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td>gel</td>
                        <td><strong>gelme</strong></td>
                        <td>¡no vengas!</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td>gelin</td>
                        <td><strong>gelmeyin</strong></td>
                        <td>¡no vengan!</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td>gelsin</td>
                        <td><strong>gelmesin</strong></td>
                        <td>que no venga</td>
                    </tr>
                </table>
                
                <h4>Ejemplos prácticos</h4>
                <div class="example-box">
                    <p><strong>Otur!</strong> — ¡Siéntate!</p>
                    <p><strong>Oturun!</strong> — ¡Siéntense! / ¡Siéntese!</p>
                    <p><strong>Bekle!</strong> — ¡Espera!</p>
                    <p><strong>Beklemeyin!</strong> — ¡No esperen!</p>
                    <p><strong>Kapıyı açsın.</strong> — Que abra la puerta.</p>
                    <p><strong>Konuşmasınlar.</strong> — Que no hablen.</p>
                </div>
                
                <h4>Forma cortés: -(y)iniz / -(y)ınız</h4>
                <p>Más formal y educada que el imperativo simple:</p>
                <div class="example-box">
                    <p><strong>Geliniz!</strong> — ¡Venga por favor! (muy formal)</p>
                    <p><strong>Bakınız!</strong> — ¡Mire! (cortés)</p>
                </div>
                
                <div class="tip-box">
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>Para "tú" (sen): usa solo la raíz → <em>gel, bak, oku</em></li>
                        <li>Para "usted/ustedes" (siz): añade <em>-in/-ın/-un/-ün</em></li>
                        <li>Para tercera persona: añade <em>-sin/-sın</em></li>
                        <li>Negativo: inserta <em>-me/-ma</em> antes del sufijo</li>
                    </ul>
                </div>
            `
        },
        
        'optativo': {
            title: 'Modo Optativo (İstek Kipi)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>El modo optativo expresa <strong>deseos, sugerencias o invitaciones</strong>. Se usa principalmente con "yo" (ben) y "nosotros" (biz).</p>
                
                <h4>Formación básica</h4>
                <p><strong>Raíz del verbo</strong> + <strong>-(y)A</strong> + <strong>sufijos personales</strong></p>
                
                <h4>Conjugación completa</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Sufijo</th>
                        <th>Ejemplo: gitmek (ir)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben (yo)</td>
                        <td>-(y)AyIm</td>
                        <td><strong>gideyim</strong></td>
                        <td>déjame ir / iré</td>
                    </tr>
                    <tr>
                        <td>Sen (tú)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>(no se usa)</td>
                    </tr>
                    <tr>
                        <td>O (él/ella)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>(no se usa)</td>
                    </tr>
                    <tr>
                        <td>Biz (nosotros)</td>
                        <td>-(y)AlIm</td>
                        <td><strong>gidelim</strong></td>
                        <td>vamos / vayamos</td>
                    </tr>
                    <tr>
                        <td>Siz (ustedes)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>(no se usa)</td>
                    </tr>
                    <tr>
                        <td>Onlar (ellos)</td>
                        <td>—</td>
                        <td>—</td>
                        <td>(no se usa)</td>
                    </tr>
                </table>
                
                <h4>Armonía vocálica</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Sufijo (ben)</th>
                        <th>Sufijo (biz)</th>
                        <th>Ejemplo</th>
                    </tr>
                    <tr>
                        <td>a, ı</td>
                        <td>-ayım</td>
                        <td>-alım</td>
                        <td>bak → <strong>bakayım, bakalım</strong></td>
                    </tr>
                    <tr>
                        <td>e, i</td>
                        <td>-eyim</td>
                        <td>-elim</td>
                        <td>git → <strong>gideyim, gidelim</strong></td>
                    </tr>
                    <tr>
                        <td>o, u</td>
                        <td>-ayım</td>
                        <td>-alım</td>
                        <td>oku → <strong>okuyayım, okuyalım</strong></td>
                    </tr>
                    <tr>
                        <td>ö, ü</td>
                        <td>-eyim</td>
                        <td>-elim</td>
                        <td>gör → <strong>göreyim, görelim</strong></td>
                    </tr>
                </table>
                
                <h4>Formas negativas</h4>
                <p>Se añade <strong>-me/-ma</strong> antes del sufijo optativo:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>gideyim</td>
                        <td><strong>gitmeyeyim</strong></td>
                        <td>no vaya / mejor no voy</td>
                    </tr>
                    <tr>
                        <td>gidelim</td>
                        <td><strong>gitmeyelim</strong></td>
                        <td>no vayamos</td>
                    </tr>
                    <tr>
                        <td>alayım</td>
                        <td><strong>almayayım</strong></td>
                        <td>no compre / mejor no compro</td>
                    </tr>
                </table>
                
                <h4>Uso con preguntas</h4>
                <p>Para hacer sugerencias o pedir permiso, añade <strong>mi/mı/mu/mü</strong>:</p>
                <div class="example-box">
                    <p><strong>Gidelim mi?</strong> — ¿Vamos?</p>
                    <p><strong>Kahve içelim mi?</strong> — ¿Tomamos café?</p>
                    <p><strong>Yardım edeyim mi?</strong> — ¿Te ayudo?</p>
                    <p><strong>Kapıyı açayım mı?</strong> — ¿Abro la puerta?</p>
                </div>
                
                <h4>Ejemplos prácticos</h4>
                <div class="example-box">
                    <p><strong>Ben yemek yapayım.</strong> — Déjame cocinar / Yo cocino.</p>
                    <p><strong>Sinemaya gidelim.</strong> — Vamos al cine.</p>
                    <p><strong>Sana hediye alayım.</strong> — Te compro un regalo.</p>
                    <p><strong>Bu akşam erken yatalım.</strong> — Acostémonos temprano esta noche.</p>
                    <p><strong>Çok konuşmayayım.</strong> — Mejor no hablo mucho.</p>
                </div>
                
                <div class="tip-box">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>Principalmente para <em>ben</em> y <em>biz</em></li>
                        <li>Ben: <em>-(y)AyIm</em> → gideyim, bakayım</li>
                        <li>Biz: <em>-(y)AlIm</em> → gidelim, bakalım</li>
                        <li>Con pregunta: <em>gidelim mi?</em> = ¿vamos?</li>
                        <li>Negativo: inserta <em>-me/-ma</em> → gitmeyelim</li>
                    </ul>
                </div>
            `
        },
        
        'derivativos': {
            title: 'Sufijos Derivativos (-lI, -sIz, -lIk)',
            content: `
                <h4>¿Qué expresan?</h4>
                <p>Estos sufijos transforman <strong>sustantivos en adjetivos o nuevos sustantivos</strong>, añadiendo significados de posesión, ausencia o cualidad.</p>
                
                <h4>1. Sufijo -lI (con, que tiene)</h4>
                <p>Indica que algo <strong>posee o contiene</strong> la cualidad del sustantivo base.</p>
                
                <h5>Armonía vocálica:</h5>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Forma</th>
                        <th>Ejemplo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>a, ı</td>
                        <td>-lı</td>
                        <td>tuz → <strong>tuzlu</strong></td>
                        <td>con sal / salado</td>
                    </tr>
                    <tr>
                        <td>e, i</td>
                        <td>-li</td>
                        <td>süt → <strong>sütlü</strong></td>
                        <td>con leche / lácteo</td>
                    </tr>
                    <tr>
                        <td>o, u</td>
                        <td>-lu</td>
                        <td>şeker → <strong>şekerlu</strong></td>
                        <td>con azúcar / dulce</td>
                    </tr>
                    <tr>
                        <td>ö, ü</td>
                        <td>-lü</td>
                        <td>göz → <strong>gözlü</strong></td>
                        <td>con ojos / que tiene ojos</td>
                    </tr>
                </table>
                
                <h5>Más ejemplos:</h5>
                <div class="example-box">
                    <p><strong>Yeşilli elbise</strong> — vestido verde (con verde)</p>
                    <p><strong>Peynirli sandviç</strong> — sándwich con queso</p>
                    <p><strong>Güçlü adam</strong> — hombre fuerte (con fuerza)</p>
                    <p><strong>Renkli kalem</strong> — lápiz de colores</p>
                </div>
                
                <h4>2. Sufijo -sIz (sin, que no tiene)</h4>
                <p>Es el <strong>opuesto de -lI</strong>, indica <strong>ausencia</strong> o falta de algo.</p>
                
                <h5>Armonía vocálica:</h5>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Forma</th>
                        <th>Ejemplo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>a, ı</td>
                        <td>-sız</td>
                        <td>tuz → <strong>tuzsuz</strong></td>
                        <td>sin sal / insípido</td>
                    </tr>
                    <tr>
                        <td>e, i</td>
                        <td>-siz</td>
                        <td>süt → <strong>sütsüz</strong></td>
                        <td>sin leche</td>
                    </tr>
                    <tr>
                        <td>o, u</td>
                        <td>-suz</td>
                        <td>şeker → <strong>şekersiz</strong></td>
                        <td>sin azúcar</td>
                    </tr>
                    <tr>
                        <td>ö, ü</td>
                        <td>-süz</td>
                        <td>göz → <strong>gözsüz</strong></td>
                        <td>sin ojos</td>
                    </tr>
                </table>
                
                <h5>Más ejemplos:</h5>
                <div class="example-box">
                    <p><strong>Şekersiz çay</strong> — té sin azúcar</p>
                    <p><strong>Tuzsuz yemek</strong> — comida sin sal</p>
                    <p><strong>Anlamsız söz</strong> — palabra sin sentido</p>
                    <p><strong>Güçsüz kalmak</strong> — quedar sin fuerzas</p>
                </div>
                
                <h4>3. Sufijo -lIk (para, de la medida de)</h4>
                <p>Tiene varios usos: <strong>propósito, cantidad, medida, cualidad abstracta</strong>.</p>
                
                <h5>A. Propósito (para qué sirve):</h5>
                <div class="example-box">
                    <p><strong>Kitaplık</strong> — estantería (para libros)</p>
                    <p><strong>Tuzluk</strong> — salero (para sal)</p>
                    <p><strong>Gözlük</strong> — gafas (para los ojos)</p>
                    <p><strong>Yazlık</strong> — casa de verano</p>
                </div>
                
                <h5>B. Cantidad/Medida:</h5>
                <div class="example-box">
                    <p><strong>İki kişilik masa</strong> — mesa para dos personas</p>
                    <p><strong>Beş liralık ekmek</strong> — pan de cinco liras</p>
                    <p><strong>Üç günlük tatil</strong> — vacaciones de tres días</p>
                </div>
                
                <h5>C. Cualidad abstracta (de adjetivos):</h5>
                <div class="example-box">
                    <p><strong>Güzel → güzellik</strong> — belleza</p>
                    <p><strong>İyi → iyilik</strong> — bondad</p>
                    <p><strong>Hasta → hastalık</strong> — enfermedad</p>
                    <p><strong>Mutlu → mutluluk</strong> — felicidad</p>
                </div>
                
                <h4>Tabla comparativa de los tres sufijos</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Raíz</th>
                        <th>-lI (con)</th>
                        <th>-sIz (sin)</th>
                        <th>-lIk (para/cualidad)</th>
                    </tr>
                    <tr>
                        <td>tuz (sal)</td>
                        <td>tuzlu (salado)</td>
                        <td>tuzsuz (sin sal)</td>
                        <td>tuzluk (salero)</td>
                    </tr>
                    <tr>
                        <td>şeker (azúcar)</td>
                        <td>şekerli (dulce)</td>
                        <td>şekersiz (sin azúcar)</td>
                        <td>şekerlik (azucarero)</td>
                    </tr>
                    <tr>
                        <td>güç (fuerza)</td>
                        <td>güçlü (fuerte)</td>
                        <td>güçsüz (débil)</td>
                        <td>güçlük (dificultad)</td>
                    </tr>
                    <tr>
                        <td>renk (color)</td>
                        <td>renkli (colorido)</td>
                        <td>renksiz (sin color)</td>
                        <td>renklilik (coloración)</td>
                    </tr>
                </table>
                
                <div class="tip-box">
                    <i class="fas fa-magic"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li><strong>-lI</strong> = con algo, que tiene → <em>tuzlu, güçlü</em></li>
                        <li><strong>-sIz</strong> = sin algo, que no tiene → <em>tuzsuz, güçsüz</em></li>
                        <li><strong>-lIk</strong> = para algo / cualidad → <em>tuzluk, güzellik</em></li>
                        <li>Todos siguen armonía vocálica estricta</li>
                    </ul>
                </div>
            `
        },
        
        'pasado-simple': {
            title: 'Pasado Simple (-DI)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>El pasado simple indica <strong>acciones completadas</strong> en el pasado que el hablante <strong>presenció o experimentó directamente</strong>. Equivale al pretérito indefinido español.</p>
                
                <h4>Formación básica</h4>
                <p><strong>Raíz del verbo</strong> + <strong>-DI</strong> + <strong>sufijos personales</strong></p>
                
                <h4>Armonía vocálica para -DI</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Sufijo</th>
                        <th>Ejemplo (raíz)</th>
                    </tr>
                    <tr>
                        <td>a, ı</td>
                        <td>-dı</td>
                        <td>bak → <strong>baktı</strong></td>
                    </tr>
                    <tr>
                        <td>e, i</td>
                        <td>-di</td>
                        <td>gel → <strong>geldi</strong></td>
                    </tr>
                    <tr>
                        <td>o, u</td>
                        <td>-du</td>
                        <td>oku → <strong>okudu</strong></td>
                    </tr>
                    <tr>
                        <td>ö, ü</td>
                        <td>-dü</td>
                        <td>gör → <strong>gördü</strong></td>
                    </tr>
                </table>
                
                <h4>Asimilación consonántica</h4>
                <p>Si la raíz termina en consonante sorda (f, s, t, k, ç, ş, h, p), el sufijo se convierte en <strong>-tI</strong> (no -dI):</p>
                <table class="comparison-table">
                    <tr>
                        <th>Raíz</th>
                        <th>Sufijo correcto</th>
                        <th>Forma pasada</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>git-</td>
                        <td>-ti</td>
                        <td><strong>gitti</strong></td>
                        <td>fue/fue</td>
                    </tr>
                    <tr>
                        <td>bak-</td>
                        <td>-tı</td>
                        <td><strong>baktı</strong></td>
                        <td>miró</td>
                    </tr>
                    <tr>
                        <td>seç-</td>
                        <td>-ti</td>
                        <td><strong>seçti</strong></td>
                        <td>eligió</td>
                    </tr>
                    <tr>
                        <td>iç-</td>
                        <td>-ti</td>
                        <td><strong>içti</strong></td>
                        <td>bebió</td>
                    </tr>
                </table>
                
                <h4>Conjugación completa (verbo: gelmek - venir)</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Forma</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben</td>
                        <td><strong>geldim</strong></td>
                        <td>vine</td>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td><strong>geldin</strong></td>
                        <td>viniste</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td><strong>geldi</strong></td>
                        <td>vino</td>
                    </tr>
                    <tr>
                        <td>Biz</td>
                        <td><strong>geldik</strong></td>
                        <td>vinimos</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td><strong>geldiniz</strong></td>
                        <td>vinieron/viniste (formal)</td>
                    </tr>
                    <tr>
                        <td>Onlar</td>
                        <td><strong>geldiler</strong></td>
                        <td>vinieron</td>
                    </tr>
                </table>
                
                <h4>Forma negativa</h4>
                <p>Se añade <strong>-me/-ma</strong> antes de -DI:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>geldim</td>
                        <td><strong>gelmedim</strong></td>
                        <td>no vine</td>
                    </tr>
                    <tr>
                        <td>geldin</td>
                        <td><strong>gelmedin</strong></td>
                        <td>no viniste</td>
                    </tr>
                    <tr>
                        <td>geldi</td>
                        <td><strong>gelmedi</strong></td>
                        <td>no vino</td>
                    </tr>
                </table>
                
                <h4>Forma interrogativa</h4>
                <p>Se añade <strong>mi/mı/mu/mü</strong> después del sufijo personal:</p>
                <div class="example-box">
                    <p><strong>Geldin mi?</strong> — ¿Viniste?</p>
                    <p><strong>Gördün mü?</strong> — ¿Viste?</p>
                    <p><strong>Yaptı mı?</strong> — ¿Hizo?</p>
                    <p><strong>İçtiniz mi?</strong> — ¿Bebieron?</p>
                </div>
                
                <h4>Ejemplos prácticos</h4>
                <div class="example-box">
                    <p><strong>Dün sinemaya gittim.</strong> — Ayer fui al cine.</p>
                    <p><strong>Kahvaltıda ekmek yedik.</strong> — Comimos pan en el desayuno.</p>
                    <p><strong>O bana bir hediye verdi.</strong> — Él/ella me dio un regalo.</p>
                    <p><strong>Geçen hafta Ankara'ya gittiler.</strong> — La semana pasada fueron a Ankara.
                    <p><strong>Kitabı okumadım.</strong> — No leí el libro.</p>
                    <p><strong>Seni gördü mü?</strong> — ¿Te vio?</p>
                </div>
                
                <h4>Verbos irregulares comunes</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Infinitivo</th>
                        <th>Raíz pasada</th>
                        <th>Ejemplo (3ª persona)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>gitmek (ir)</td>
                        <td>git-</td>
                        <td><strong>gitti</strong></td>
                        <td>fue</td>
                    </tr>
                    <tr>
                        <td>etmek (hacer)</td>
                        <td>et-</td>
                        <td><strong>etti</strong></td>
                        <td>hizo</td>
                    </tr>
                    <tr>
                        <td>demek (decir)</td>
                        <td>de-</td>
                        <td><strong>dedi</strong></td>
                        <td>dijo</td>
                    </tr>
                </table>
                
                <div class="tip-box">
                    <i class="fas fa-clock"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>-DI sigue armonía vocálica: <em>-dı/-di/-du/-dü</em></li>
                        <li>Tras consonante sorda → usa <em>-tI</em>: gitti, baktı</li>
                        <li>Negativo: inserta <em>-me/-ma</em> → gelmedim</li>
                        <li>Pregunta: añade <em>mi/mı/mu/mü</em> → geldin mi?</li>
                        <li>Expresa hechos que <strong>presenciaste directamente</strong></li>
                    </ul>
                </div>
            `
        },
        
        'pasado-ser': {
            title: 'Pasado del Verbo "Ser/Estar" (idi)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>Se usa para describir <strong>estados pasados</strong> con adjetivos, sustantivos o ubicaciones. Equivale a "era/estaba" en español.</p>
                
                <h4>Formación básica</h4>
                <p><strong>Adjetivo/Sustantivo</strong> + <strong>-(y)DI</strong> + <strong>sufijos personales</strong></p>
                
                <h4>Conjugación completa</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Sufijo</th>
                        <th>Ejemplo (mutlu = feliz)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben</td>
                        <td>-(y)dım/dim/dum/düm</td>
                        <td><strong>mutluydum</strong></td>
                        <td>yo era/estaba feliz</td>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td>-(y)dın/din/dun/dün</td>
                        <td><strong>mutluydun</strong></td>
                        <td>tú eras/estabas feliz</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td>-(y)dı/di/du/dü</td>
                        <td><strong>mutluydu</strong></td>
                        <td>él/ella era/estaba feliz</td>
                    </tr>
                    <tr>
                        <td>Biz</td>
                        <td>-(y)dık/dik/duk/dük</td>
                        <td><strong>mutluyduk</strong></td>
                        <td>nosotros éramos/estábamos felices</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td>-(y)dınız/diniz/dunuz/dünüz</td>
                        <td><strong>mutluydunuz</strong></td>
                        <td>ustedes eran/estaban felices</td>
                    </tr>
                    <tr>
                        <td>Onlar</td>
                        <td>-(y)dılar/diler/dular/düler</td>
                        <td><strong>mutluydular</strong> o <strong>mutlulardı</strong></td>
                        <td>ellos eran/estaban felices</td>
                    </tr>
                </table>
                
                <h4>Regla del buffer "y"</h4>
                <p>Si la palabra termina en <strong>vocal</strong>, se inserta una <strong>y</strong> antes del sufijo:</p>
                <div class="example-box">
                    <p><strong>Mutlu + dım → mutlu<u>y</u>dum</strong></p>
                    <p><strong>Hasta + dım → hasta<u>y</u>dım</strong></p>
                    <p><strong>Öğrenci + dim → öğrenci<u>y</u>dim</strong></p>
                </div>
                
                <p>Si termina en <strong>consonante</strong>, no se necesita "y":</p>
                <div class="example-box">
                    <p><strong>Yorgun + dum → yorgundum</strong></p>
                    <p><strong>İyi + dim → iyidim</strong> (sin y porque "i" es parte de la palabra)</p>
                </div>
                
                <h4>Con sustantivos (profesiones, identidad)</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Presente</th>
                        <th>Pasado</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Öğrenciyim</td>
                        <td><strong>Öğrenciydim</strong></td>
                        <td>Era estudiante</td>
                    </tr>
                    <tr>
                        <td>Doktorsun</td>
                        <td><strong>Doktordun</strong></td>
                        <td>Eras doctor</td>
                    </tr>
                    <tr>
                        <td>Öğretmen</td>
                        <td><strong>Öğretmendi</strong></td>
                        <td>Era profesor</td>
                    </tr>
                    <tr>
                        <td>Türküz</td>
                        <td><strong>Türktük</strong></td>
                        <td>Éramos turcos</td>
                    </tr>
                </table>
                
                <h4>Con ubicaciones</h4>
                <div class="example-box">
                    <p><strong>Evdeydim.</strong> — Estaba en casa.</p>
                    <p><strong>Okulda mıydın?</strong> — ¿Estabas en la escuela?</p>
                    <p><strong>İstanbul'daydık.</strong> — Estábamos en Estambul.</p>
                    <p><strong>Parkta değildiler.</strong> — No estaban en el parque.</p>
                </div>
                
                <h4>Forma negativa</h4>
                <p>Se usa <strong>değil</strong> + sufijo pasado:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Mutluydum</td>
                        <td><strong>Mutlu değildim</strong></td>
                        <td>No era/estaba feliz</td>
                    </tr>
                    <tr>
                        <td>Hastaydın</td>
                        <td><strong>Hasta değildin</strong></td>
                        <td>No estabas enfermo</td>
                    </tr>
                    <tr>
                        <td>Evdeydi</td>
                        <td><strong>Evde değildi</strong></td>
                        <td>No estaba en casa</td>
                    </tr>
                </table>
                
                <h4>Forma interrogativa</h4>
                <p>Se añade <strong>mi/mı/mu/mü</strong> antes del sufijo:</p>
                <div class="example-box">
                    <p><strong>Mutlu muydum?</strong> — ¿Era/estaba feliz?</p>
                    <p><strong>Öğrenci miydin?</strong> — ¿Eras estudiante?</p>
                    <p><strong>Evde miydi?</strong> — ¿Estaba en casa?</p>
                    <p><strong>Hazır mıydınız?</strong> — ¿Estaban listos?</p>
                </div>
                
                <h4>Comparación presente vs. pasado</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Presente</th>
                        <th>Pasado</th>
                        <th>Traducción pasado</th>
                    </tr>
                    <tr>
                        <td>Öğrenciyim</td>
                        <td>Öğrenciydim</td>
                        <td>Era estudiante</td>
                    </tr>
                    <tr>
                        <td>Mutlusun</td>
                        <td>Mutluydun</td>
                        <td>Eras feliz</td>
                    </tr>
                    <tr>
                        <td>Yorgun</td>
                        <td>Yorgundu</td>
                        <td>Estaba cansado</td>
                    </tr>
                    <tr>
                        <td>Evdeyiz</td>
                        <td>Evdeydik</td>
                        <td>Estábamos en casa</td>
                    </tr>
                    <tr>
                        <td>Hazırsınız</td>
                        <td>Hazırdınız</td>
                        <td>Estaban listos</td>
                    </tr>
                </table>
                
                <div class="tip-box">
                    <i class="fas fa-history"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>Tras vocal: inserta <em>y</em> → mutlu<strong>y</strong>dum</li>
                        <li>Tras consonante: directo → yorgun<strong>dum</strong></li>
                        <li>Sigue armonía vocálica: <em>-dım/-dim/-dum/-düm</em></li>
                        <li>Negativo: usa <em>değil + sufijo</em> → değildim</li>
                        <li>Pregunta: <em>mi/mı/mu/mü + sufijo</em> → muydum?</li>
                    </ul>
                </div>
            `
        },
        
        'conjunciones': {
            title: 'Conjunciones Causales',
            content: `
                <h4>¿Qué expresan?</h4>
                <p>Estas conjunciones unen oraciones indicando <strong>causa y efecto</strong>. Todas significan "porque/por eso" pero tienen posiciones diferentes en la oración.</p>
                
                <h4>1. Çünkü (porque)</h4>
                <p>Introduce la <strong>razón</strong> o <strong>causa</strong>. Va al inicio de la segunda oración.</p>
                
                <h5>Estructura:</h5>
                <p><strong>[Efecto/Resultado], çünkü [Causa]</strong></p>
                
                <div class="example-box">
                    <p><strong>Okula gitmedim, çünkü hastaydım.</strong></p>
                    <p>→ No fui a la escuela <em>porque</em> estaba enfermo.</p>
                    <br>
                    <p><strong>Mutluyum, çünkü sınavı geçtim.</strong></p>
                    <p>→ Estoy feliz <em>porque</em> aprobé el examen.</p>
                    <br>
                    <p><strong>Eve erken döndük, çünkü yağmur yağdı.</strong></p>
                    <p>→ Volvimos temprano a casa <em>porque</em> llovió.</p>
                </div>
                
                <h4>2. Bu yüzden / Bu nedenle / Bu sebeple (por eso / por esta razón)</h4>
                <p>Introducen el <strong>resultado</strong> o <strong>consecuencia</strong>. Van al inicio de la segunda oración.</p>
                
                <h5>Estructura:</h5>
                <p><strong>[Causa]. Bu yüzden/nedenle/sebeple [Efecto/Resultado]</strong></p>
                
                <div class="example-box">
                    <p><strong>Hastaydım. Bu yüzden okula gitmedim.</strong></p>
                    <p>→ Estaba enfermo. <em>Por eso</em> no fui a la escuela.</p>
                    <br>
                    <p><strong>Çok yorgunum. Bu nedenle erken yatacağım.</strong></p>
                    <p>→ Estoy muy cansado. <em>Por esta razón</em> me acostaré temprano.</p>
                    <br>
                    <p><strong>Trafik vardı. Bu sebeple geç kaldım.</strong></p>
                    <p>→ Había tráfico. <em>Por ese motivo</em> llegué tarde.</p>
                </div>
                
                <h4>3. Bunun için (para esto / por eso)</h4>
                <p>Similar a los anteriores, pero puede expresar tanto <strong>propósito</strong> como <strong>resultado</strong>.</p>
                
                <div class="example-box">
                    <p><strong>Sınav var. Bunun için çok çalışmalıyım.</strong></p>
                    <p>→ Hay examen. <em>Para esto</em> debo estudiar mucho.</p>
                    <br>
                    <p><strong>Param yoktu. Bunun için hiçbir şey alamadım.</strong></p>
                    <p>→ No tenía dinero. <em>Por eso</em> no pude comprar nada.</p>
                </div>
                
                <h4>Tabla comparativa de posiciones</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Conjunción</th>
                        <th>Posición</th>
                        <th>Qué introduce</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td><strong>çünkü</strong></td>
                        <td>Antes de la causa</td>
                        <td>Razón</td>
                        <td>porque</td>
                    </tr>
                    <tr>
                        <td><strong>bu yüzden</strong></td>
                        <td>Antes del resultado</td>
                        <td>Consecuencia</td>
                        <td>por eso</td>
                    </tr>
                    <tr>
                        <td><strong>bu nedenle</strong></td>
                        <td>Antes del resultado</td>
                        <td>Consecuencia</td>
                        <td>por esta razón</td>
                    </tr>
                    <tr>
                        <td><strong>bu sebeple</strong></td>
                        <td>Antes del resultado</td>
                        <td>Consecuencia</td>
                        <td>por este motivo</td>
                    </tr>
                    <tr>
                        <td><strong>bunun için</strong></td>
                        <td>Antes del resultado/propósito</td>
                        <td>Consecuencia o propósito</td>
                        <td>para esto / por eso</td>
                    </tr>
                </table>
                
                <h4>Ejemplos con las mismas oraciones</h4>
                
                <h5>Opción 1: Usando çünkü (Resultado + çünkü + Causa)</h5>
                <div class="example-box">
                    <p><strong>Okula gitmedim, çünkü hastaydım.</strong></p>
                    <p>→ No fui a la escuela porque estaba enfermo.</p>
                </div>
                
                <h5>Opción 2: Usando bu yüzden (Causa + bu yüzden + Resultado)</h5>
                <div class="example-box">
                    <p><strong>Hastaydım. Bu yüzden okula gitmedim.</strong></p>
                    <p>→ Estaba enfermo. Por eso no fui a la escuela.</p>
                </div>
                
                <h4>Diferencias sutiles de registro</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Conjunción</th>
                        <th>Registro</th>
                        <th>Uso común</th>
                    </tr>
                    <tr>
                        <td>çünkü</td>
                        <td>Neutral</td>
                        <td>Conversación cotidiana</td>
                    </tr>
                    <tr>
                        <td>bu yüzden</td>
                        <td>Neutral/Informal</td>
                        <td>Muy común, hablado y escrito</td>
                    </tr>
                    <tr>
                        <td>bu nedenle</td>
                        <td>Formal</td>
                        <td>Textos escritos, noticias</td>
                    </tr>
                    <tr>
                        <td>bu sebeple</td>
                        <td>Formal</td>
                        <td>Textos escritos, académico</td>
                    </tr>
                    <tr>
                        <td>bunun için</td>
                        <td>Neutral</td>
                        <td>Conversación y texto</td>
                    </tr>
                </table>
                
                <h4>Más ejemplos prácticos</h4>
                <div class="example-box">
                    <p><strong>Param yok, çünkü çok para harcadım.</strong></p>
                    <p>→ No tengo dinero porque gasté mucho.</p>
                    <br>
                    <p><strong>Çok para harcadım. Bu yüzden param yok.</strong></p>
                    <p>→ Gasté mucho dinero. Por eso no tengo dinero.</p>
                    <br>
                    <p><strong>Türkçe öğrenmek istiyorum. Bunun için her gün ders çalışıyorum.</strong></p>
                    <p>→ Quiero aprender turco. Para esto estudio todos los días.</p>
                    <br>
                    <p><strong>Yağmur yağıyor. Bu nedenle şemsiye almalısın.</strong></p>
                    <p>→ Está lloviendo. Por esta razón debes llevar paraguas.</p>
                </div>
                
                <div class="tip-box">
                    <i class="fas fa-link"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li><strong>çünkü</strong> → introduce la CAUSA (va después del resultado)</li>
                        <li><strong>bu yüzden / bu nedenle / bu sebeple</strong> → introducen el RESULTADO (van después de la causa)</li>
                        <li><em>çünkü</em>: más informal y conversacional</li>
                        <li><em>bu nedenle / bu sebeple</em>: más formales, para textos escritos</li>
                    </ul>
                </div>
            `
        },
        
        'ile': {
            title: 'Posposición "ile" (con)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>La posposición <strong>ile</strong> indica <strong>compañía</strong>, <strong>instrumento</strong> o <strong>medio</strong>. Equivale a "con" en español.</p>
                
                <h4>Formas de uso</h4>
                
                <h5>1. Forma completa: ile (escrito, formal)</h5>
                <p>Se escribe como palabra separada:</p>
                <div class="example-box">
                    <p><strong>Ben arkadaşım ile gidiyorum.</strong></p>
                    <p>→ Voy con mi amigo.</p>
                    <br>
                    <p><strong>Kalem ile yazıyorum.</strong></p>
                    <p>→ Escribo con bolígrafo.</p>
                </div>
                
                <h5>2. Forma contraída: -(y)le/-(y)la (hablado, informal)</h5>
                <p>Se une a la palabra anterior como sufijo:</p>
                
                <h6>Reglas de unión:</h6>
                <ul>
                    <li>Si la palabra termina en <strong>consonante</strong> → añade <strong>-le/-la</strong></li>
                    <li>Si la palabra termina en <strong>vocal</strong> → añade <strong>-yle/-yla</strong></li>
                </ul>
                
                <h6>Armonía vocálica:</h6>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Tras consonante</th>
                        <th>Tras vocal</th>
                        <th>Ejemplo</th>
                    </tr>
                    <tr>
                        <td>a, ı, o, u</td>
                        <td>-la</td>
                        <td>-yla</td>
                        <td>araba<strong>yla</strong>, okul<strong>la</strong></td>
                    </tr>
                    <tr>
                        <td>e, i, ö, ü</td>
                        <td>-le</td>
                        <td>-yle</td>
                        <td>anne<strong>yle</strong>, süt<strong>le</strong></td>
                    </tr>
                </table>
                
                <h4>1. Compañía (con quién)</h4>
                <div class="example-box">
                    <p><strong>Arkadaşımla sinemaya gittim.</strong></p>
                    <p>→ Fui al cine con mi amigo.</p>
                    <br>
                    <p><strong>Annemle telefon konuştum.</strong></p>
                    <p>→ Hablé por teléfono con mi madre.</p>
                    <br>
                    <p><strong>Seninle çalışmak istiyorum.</strong></p>
                    <p>→ Quiero trabajar contigo.</p>
                </div>
                
                <h4>2. Instrumento (con qué)</h4>
                <div class="example-box">
                    <p><strong>Kalemle yazıyorum.</strong></p>
                    <p>→ Escribo con bolígrafo.</p>
                    <br>
                    <p><strong>Bıçakla ekmek kestim.</strong></p>
                    <p>→ Corté el pan con cuchillo.</p>
                    <br>
                    <p><strong>Elimle yedim.</strong></p>
                    <p>→ Comí con la mano.</p>
                </div>
                
                <h4>3. Medio de transporte</h4>
                <div class="example-box">
                    <p><strong>Otobüsle geldim.</strong></p>
                    <p>→ Vine en autobús.</p>
                    <br>
                    <p><strong>Arabayla mı gideceksin?</strong></p>
                    <p>→ ¿Irás en coche?</p>
                    <br>
                    <p><strong>Uçakla seyahat ettiler.</strong></p>
                    <p>→ Viajaron en avión.</p>
                </div>
                
                <h4>Con pronombres personales</h4>
                <p>Los pronombres toman el sufijo genitivo antes de "ile":</p>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>+ ile</th>
                        <th>Forma contraída</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>ben</td>
                        <td>benim ile</td>
                        <td><strong>benimle</strong></td>
                        <td>conmigo</td>
                    </tr>
                    <tr>
                        <td>sen</td>
                        <td>senin ile</td>
                        <td><strong>seninle</strong></td>
                        <td>contigo</td>
                    </tr>
                    <tr>
                        <td>o</td>
                        <td>onun ile</td>
                        <td><strong>onunla</strong></td>
                        <td>con él/ella</td>
                    </tr>
                    <tr>
                        <td>biz</td>
                        <td>bizim ile</td>
                        <td><strong>bizimle</strong></td>
                        <td>con nosotros</td>
                    </tr>
                    <tr>
                        <td>siz</td>
                        <td>sizin ile</td>
                        <td><strong>sizinle</strong></td>
                        <td>con ustedes</td>
                    </tr>
                    <tr>
                        <td>onlar</td>
                        <td>onların ile</td>
                        <td><strong>onlarla</strong></td>
                        <td>con ellos</td>
                    </tr>
                </table>
                
                <h4>Ejemplos con pronombres</h4>
                <div class="example-box">
                    <p><strong>Benimle gelir misin?</strong></p>
                    <p>→ ¿Vienes conmigo?</p>
                    <br>
                    <p><strong>Seninle dans etmek istiyorum.</strong></p>
                    <p>→ Quiero bailar contigo.</p>
                    <br>
                    <p><strong>Onunla konuşmadım.</strong></p>
                    <p>→ No hablé con él/ella.</p>
                    <br>
                    <p><strong>Bizimle yemek yer misiniz?</strong></p>
                    <p>→ ¿Comen con nosotros?</p>
                </div>
                
                <h4>Forma completa vs. contraída</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Completa (formal)</th>
                        <th>Contraída (informal)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Arkadaşım ile</td>
                        <td>Arkadaşımla</td>
                        <td>con mi amigo</td>
                    </tr>
                    <tr>
                        <td>Kalem ile</td>
                        <td>Kalemle</td>
                        <td>con bolígrafo</td>
                    </tr>
                    <tr>
                        <td>Araba ile</td>
                        <td>Arabayla</td>
                        <td>en coche</td>
                    </tr>
                    <tr>
                        <td>Anne ile</td>
                        <td>Anneyle</td>
                        <td>con madre</td>
                    </tr>
                </table>
                
                <h4>Usos especiales</h4>
                
                <h5>A. Con nombres propios:</h5>
                <div class="example-box">
                    <p><strong>Ahmet'le sinemaya gittik.</strong></p>
                    <p>→ Fuimos al cine con Ahmet.</p>
                    <br>
                    <p><strong>Ayşe ile evlendi.</strong></p>
                    <p>→ Se casó con Ayşe.</p>
                </div>
                
                <h5>B. Expresiones fijas:</h5>
                <div class="example-box">
                    <p><strong>Birlikte / beraber</strong> → juntos (sin "ile")</p>
                    <p><strong>İle birlikte</strong> → junto con</p>
                    <p><em>Ailesiyle birlikte geldi.</em> → Vino junto con su familia.</p>
                </div>
                
                <div class="tip-box">
                    <i class="fas fa-hand-holding-heart"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>Forma completa: <strong>ile</strong> (separado, formal)</li>
                        <li>Forma contraída: <strong>-(y)le/-(y)la</strong> (unido, informal)</li>
                        <li>Con pronombres: usa genitivo → <em>benimle, seninle</em></li>
                        <li>Sigue armonía vocálica: <em>-
                        le/-la</em> según la última vocal</li>
                        <li>Tras vocal: añade <strong>y</strong> → arabayla, anneyle</li>
                        <li>Tras consonante: directo → kalemle, okulla</li>
                    </ul>
                </div>
            `
        },
        
        'futuro': {
            title: 'Tiempo Futuro (-AcAk)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>El tiempo futuro indica <strong>acciones que ocurrirán en el futuro</strong>. Equivale al futuro simple español (haré, harás, hará...).</p>
                
                <h4>Formación básica</h4>
                <p><strong>Raíz del verbo</strong> + <strong>-AcAk/-EcEk</strong> + <strong>sufijos personales</strong></p>
                
                <h4>Armonía vocálica</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal de la raíz</th>
                        <th>Sufijo futuro</th>
                        <th>Ejemplo</th>
                    </tr>
                    <tr>
                        <td>a, ı, o, u</td>
                        <td>-acak</td>
                        <td>bak → <strong>bakacak</strong></td>
                    </tr>
                    <tr>
                        <td>e, i, ö, ü</td>
                        <td>-ecek</td>
                        <td>gel → <strong>gelecek</strong></td>
                    </tr>
                </table>
                
                <h4>Conjugación completa (verbo: gelmek - venir)</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Forma</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben</td>
                        <td><strong>geleceğim</strong></td>
                        <td>vendré</td>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td><strong>geleceksin</strong></td>
                        <td>vendrás</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td><strong>gelecek</strong></td>
                        <td>vendrá</td>
                    </tr>
                    <tr>
                        <td>Biz</td>
                        <td><strong>geleceğiz</strong></td>
                        <td>vendremos</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td><strong>geleceksiniz</strong></td>
                        <td>vendrán/vendrás (formal)</td>
                    </tr>
                    <tr>
                        <td>Onlar</td>
                        <td><strong>gelecekler</strong> o <strong>gelecek</strong></td>
                        <td>vendrán</td>
                    </tr>
                </table>
                
                <h4>Asimilación consonántica</h4>
                <p>Si la raíz termina en consonante sorda (ç, f, h, k, p, s, ş, t), ocurren cambios:</p>
                
                <h5>1. Cambio k → c</h5>
                <div class="example-box">
                    <p><strong>çık- → çıkacak</strong> (saldrá)</p>
                    <p><strong>bak- → bakacak</strong> (mirará)</p>
                </div>
                
                <h5>2. Cambio t → d (en algunos verbos)</h5>
                <div class="example-box">
                    <p><strong>git- → gidecek</strong> (irá)</p>
                    <p><strong>tat- → tadacak</strong> (probará)</p>
                </div>
                
                <h4>Verbos irregulares comunes</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Infinitivo</th>
                        <th>Futuro (3ª persona)</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>gitmek</td>
                        <td><strong>gidecek</strong></td>
                        <td>irá</td>
                    </tr>
                    <tr>
                        <td>etmek</td>
                        <td><strong>edecek</strong></td>
                        <td>hará</td>
                    </tr>
                    <tr>
                        <td>almak</td>
                        <td><strong>alacak</strong></td>
                        <td>tomará/comprará</td>
                    </tr>
                    <tr>
                        <td>yapmak</td>
                        <td><strong>yapacak</strong></td>
                        <td>hará</td>
                    </tr>
                </table>
                
                <h4>Forma negativa</h4>
                <p>Se añade <strong>-me/-ma</strong> antes del sufijo futuro:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>geleceğim</td>
                        <td><strong>gelmeyeceğim</strong></td>
                        <td>no vendré</td>
                    </tr>
                    <tr>
                        <td>geleceksin</td>
                        <td><strong>gelmeyeceksin</strong></td>
                        <td>no vendrás</td>
                    </tr>
                    <tr>
                        <td>gelecek</td>
                        <td><strong>gelmeyecek</strong></td>
                        <td>no vendrá</td>
                    </tr>
                    <tr>
                        <td>gideceğim</td>
                        <td><strong>gitmeyeceğim</strong></td>
                        <td>no iré</td>
                    </tr>
                </table>
                
                <h4>Forma interrogativa</h4>
                <p>Se añade <strong>mi/mı/mu/mü</strong> después del sufijo personal:</p>
                <div class="example-box">
                    <p><strong>Gelecek misin?</strong> — ¿Vendrás?</p>
                    <p><strong>Gidecek mi?</strong> — ¿Irá?</p>
                    <p><strong>Yapacak mısınız?</strong> — ¿Harán?</p>
                    <p><strong>Alacağım mı?</strong> — ¿Compraré/Tomaré?</p>
                </div>
                
                <h4>Ejemplos prácticos con expresiones de tiempo</h4>
                <div class="example-box">
                    <p><strong>Yarın sinemaya gideceğim.</strong></p>
                    <p>→ Mañana iré al cine.</p>
                    <br>
                    <p><strong>Gelecek hafta Ankara'ya gidecekler.</strong></p>
                    <p>→ La próxima semana irán a Ankara.</p>
                    <br>
                    <p><strong>İki saat sonra buluşacağız.</strong></p>
                    <p>→ Nos encontraremos en dos horas.</p>
                    <br>
                    <p><strong>Önümüzdeki yıl evleneceğiz.</strong></p>
                    <p>→ El próximo año nos casaremos.</p>
                    <br>
                    <p><strong>Bu akşam ne yapacaksın?</strong></p>
                    <p>→ ¿Qué harás esta noche?</p>
                </div>
                
                <h4>Expresiones temporales comunes con futuro</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Turco</th>
                        <th>Español</th>
                    </tr>
                    <tr>
                        <td>yarın</td>
                        <td>mañana</td>
                    </tr>
                    <tr>
                        <td>gelecek hafta</td>
                        <td>la próxima semana</td>
                    </tr>
                    <tr>
                        <td>gelecek ay</td>
                        <td>el próximo mes</td>
                    </tr>
                    <tr>
                        <td>gelecek yıl</td>
                        <td>el próximo año</td>
                    </tr>
                    <tr>
                        <td>önümüzdeki</td>
                        <td>próximo/que viene</td>
                    </tr>
                    <tr>
                        <td>... sonra</td>
                        <td>después de...</td>
                    </tr>
                    <tr>
                        <td>yakında</td>
                        <td>pronto</td>
                    </tr>
                </table>
                
                <h4>Uso en condicionales</h4>
                <p>El futuro turco también puede expresar <strong>suposición o probabilidad</strong>:</p>
                <div class="example-box">
                    <p><strong>Şimdi evde olacak.</strong></p>
                    <p>→ Ahora estará en casa (probablemente).</p>
                    <br>
                    <p><strong>Yarın yağmur yağacak.</strong></p>
                    <p>→ Mañana lloverá / Mañana probablemente llueva.</p>
                </div>
                
                <h4>Conjugación de otros verbos comunes</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Verbo</th>
                        <th>Ben</th>
                        <th>Sen</th>
                        <th>O</th>
                    </tr>
                    <tr>
                        <td>yapmak (hacer)</td>
                        <td>yapacağım</td>
                        <td>yapacaksın</td>
                        <td>yapacak</td>
                    </tr>
                    <tr>
                        <td>almak (tomar/comprar)</td>
                        <td>alacağım</td>
                        <td>alacaksın</td>
                        <td>alacak</td>
                    </tr>
                    <tr>
                        <td>okumak (leer)</td>
                        <td>okuyacağım</td>
                        <td>okuyacaksın</td>
                        <td>okuyacak</td>
                    </tr>
                    <tr>
                        <td>görmek (ver)</td>
                        <td>göreceğim</td>
                        <td>göreceksin</td>
                        <td>görecek</td>
                    </tr>
                </table>
                
                <div class="tip-box">
                    <i class="fas fa-calendar-alt"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li>Sufijo: <strong>-AcAk/-EcEk</strong> según armonía vocálica</li>
                        <li>Ben/Biz: <em>-ceğim/-ceğiz</em> → geleceğim, geleceğiz</li>
                        <li>Sen/Siz/Onlar: <em>-ceksin/-ceksiniz/-cekler</em></li>
                        <li>Negativo: inserta <em>-me/-ma</em> → gelmeyeceğim</li>
                        <li>Pregunta: añade <em>mi/mı/mu/mü</em> → gelecek misin?</li>
                        <li>También expresa <strong>probabilidad</strong>: şimdi evde olacak</li>
                    </ul>
                </div>
            `
        },
        
        'comparaciones': {
            title: 'Comparaciones (gibi, kadar)',
            content: `
                <h4>¿Qué expresan?</h4>
                <p>Las comparaciones en turco se hacen principalmente con dos palabras: <strong>gibi</strong> (como, similar a) y <strong>kadar</strong> (tanto como, hasta).</p>
                
                <h4>1. Gibi (como, similar a)</h4>
                <p>Indica <strong>similitud o parecido</strong>. Expresa que algo es parecido a otra cosa.</p>
                
                <h5>Estructura:</h5>
                <p><strong>[Sustantivo/Pronombre] + gibi</strong></p>
                
                <div class="example-box">
                    <p><strong>Buz gibi soğuk.</strong></p>
                    <p>→ Frío como el hielo.</p>
                    <br>
                    <p><strong>Melek gibi bir kız.</strong></p>
                    <p>→ Una chica como un ángel.</p>
                    <br>
                    <p><strong>Sen prenses gibisin.</strong></p>
                    <p>→ Eres como una princesa.</p>
                    <br>
                    <p><strong>O aslan gibi cesur.</strong></p>
                    <p>→ Él es valiente como un león.</p>
                </div>
                
                <h5>Con verbos:</h5>
                <div class="example-box">
                    <p><strong>Kuş gibi uçuyor.</strong></p>
                    <p>→ Vuela como un pájaro.</p>
                    <br>
                    <p><strong>Çocuk gibi ağlıyor.</strong></p>
                    <p>→ Llora como un niño.</p>
                </div>
                
                <h5>Expresiones idiomáticas con gibi:</h5>
                <div class="example-box">
                    <p><strong>Taş gibi</strong> → duro como una piedra</p>
                    <p><strong>Pamuk gibi</strong> → suave como el algodón</p>
                    <p><strong>Kar gibi beyaz</strong> → blanco como la nieve</p>
                    <p><strong>Güneş gibi parlak</strong> → brillante como el sol</p>
                    <p><strong>Tilki gibi kurnaz</strong> → astuto como un zorro</p>
                </div>
                
                <h4>2. Kadar (tanto como, tan... como)</h4>
                <p>Indica <strong>igualdad en cantidad, grado o medida</strong>. También significa "hasta".</p>
                
                <h5>A. Comparación de igualdad</h5>
                <p><strong>[Sustantivo/Pronombre] + kadar</strong></p>
                
                <div class="example-box">
                    <p><strong>Sen benim kadar uzunsun.</strong></p>
                    <p>→ Eres tan alto como yo.</p>
                    <br>
                    <p><strong>O, annesi kadar güzel.</strong></p>
                    <p>→ Ella es tan hermosa como su madre.</p>
                    <br>
                    <p><strong>Senin kadar çalışkan değilim.</strong></p>
                    <p>→ No soy tan trabajador como tú.</p>
                    <br>
                    <p><strong>Bu ev bizimki kadar büyük.</strong></p>
                    <p>→ Esta casa es tan grande como la nuestra.</p>
                </div>
                
                <h5>B. Cantidad/Límite (hasta)</h5>
                <div class="example-box">
                    <p><strong>İstasyon'a kadar yürüdük.</strong></p>
                    <p>→ Caminamos hasta la estación.</p>
                    <br>
                    <p><strong>Saat beşe kadar bekledim.</strong></p>
                    <p>→ Esperé hasta las cinco.</p>
                    <br>
                    <p><strong>Bu kadar yeter.</strong></p>
                    <p>→ Es suficiente hasta este punto / Esto es suficiente.</p>
                </div>
                
                <h5>Con pronombres posesivos:</h5>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>+ kadar</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben</td>
                        <td><strong>benim kadar</strong></td>
                        <td>tanto como yo</td>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td><strong>senin kadar</strong></td>
                        <td>tanto como tú</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td><strong>onun kadar</strong></td>
                        <td>tanto como él/ella</td>
                    </tr>
                    <tr>
                        <td>Biz</td>
                        <td><strong>bizim kadar</strong></td>
                        <td>tanto como nosotros</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td><strong>sizin kadar</strong></td>
                        <td>tanto como ustedes</td>
                    </tr>
                    <tr>
                        <td>Onlar</td>
                        <td><strong>onların kadar</strong></td>
                        <td>tanto como ellos</td>
                    </tr>
                </table>
                
                <h4>Diferencias entre gibi y kadar</h4>
                <table class="comparison-table">
                    <tr>
                        <th>gibi</th>
                        <th>kadar</th>
                    </tr>
                    <tr>
                        <td><strong>Similitud cualitativa</strong></td>
                        <td><strong>Igualdad cuantitativa</strong></td>
                    </tr>
                    <tr>
                        <td>"como" / "parecido a"</td>
                        <td>"tan... como" / "tanto como"</td>
                    </tr>
                    <tr>
                        <td>Compara <em>características</em></td>
                        <td>Compara <em>grados o cantidades</em></td>
                    </tr>
                    <tr>
                        <td><em>Melek gibi</em><br/>(como un ángel)</td>
                        <td><em>Senin kadar güzel</em><br/>(tan hermosa como tú)</td>
                    </tr>
                </table>
                
                <h4>Ejemplos comparativos</h4>
                
                <h5>Usando gibi (similitud):</h5>
                <div class="example-box">
                    <p><strong>Kardeşim tilki gibi akıllı.</strong></p>
                    <p>→ Mi hermano es inteligente como un zorro.</p>
                    <p><em>(Se compara la astucia con la de un zorro)</em></p>
                </div>
                
                <h5>Usando kadar (igualdad):</h5>
                <div class="example-box">
                    <p><strong>Kardeşim babam kadar akıllı.</strong></p>
                    <p>→ Mi hermano es tan inteligente como mi padre.</p>
                    <p><em>(Se compara el grado de inteligencia exacto)</em></p>
                </div>
                
                <h4>Estructuras negativas</h4>
                <div class="example-box">
                    <p><strong>O benim gibi değil.</strong></p>
                    <p>→ Él/ella no es como yo.</p>
                    <br>
                    <p><strong>Sen onun kadar güzel değilsin.</strong></p>
                    <p>→ No eres tan hermosa como ella.</p>
                </div>
                
                <h4>Uso combinado de -DAn... -yA kadar</h4>
                <p>Para expresar "desde... hasta":</p>
                <div class="example-box">
                    <p><strong>Sabahtan akşama kadar çalıştım.</strong></p>
                    <p>→ Trabajé desde la mañana hasta la noche.</p>
                    <br>
                    <p><strong>Pazartesiden cumaya kadar okula gidiyorum.</strong></p>
                    <p>→ Voy a la escuela desde el lunes hasta el viernes.</p>
                </div>
                
                <h4>Expresiones idiomáticas</h4>
                <div class="example-box">
                    <p><strong>Elimden geldiği kadar</strong> → Tanto como pueda / Lo mejor que pueda</p>
                    <p><strong>Bildiğim kadarıyla</strong> → Hasta donde yo sé</p>
                    <p><strong>Mümkün olduğu kadar</strong> → Tanto como sea posible</p>
                    <p><strong>Ne kadar</strong> → Cuánto / Qué tanto</p>
                </div>
                
                <h4>Más ejemplos prácticos</h4>
                <div class="example-box">
                    <p><strong>Türkçe, İngilizce kadar zor değil.</strong></p>
                    <p>→ El turco no es tan difícil como el inglés.</p>
                    <br>
                    <p><strong>O, bir fil gibi güçlü.</strong></p>
                    <p>→ Él es fuerte como un elefante.</p>
                    <br>
                    <p><strong>Bu elbise seninkisi kadar pahalı.</strong></p>
                    <p>→ Este vestido es tan caro como el tuyo.</p>
                    <br>
                    <p><strong>Kardeşim tavşan gibi hızlı koşuyor.</strong></p>
                    <p>→ Mi hermano corre rápido como un conejo.</p>
                </div>
                
                <div class="tip-box">
                    <i class="fas fa-balance-scale"></i>
                    <strong>Recuerda:</strong>
                    <ul>
                        <li><strong>gibi</strong> → similitud, parecido → <em>"como"</em></li>
                        <li><strong>kadar</strong> → igualdad, cantidad → <em>"tan... como"</em></li>
                        <li>gibi: compara <em>cualidades</em> → melek gibi</li>
                        <li>kadar: compara <em>grados/medidas</em> → senin kadar</li>
                        <li>kadar también significa <em>"hasta"</em> → saat beşe kadar</li>
                    </ul>
                </div>
            `
        },
        
        'pasado-reportado': {
            title: 'Pasado Reportado (-mIş)',
            content: `
                <h4>¿Qué expresa?</h4>
                <p>El pasado reportado (miş'li geçmiş zaman) indica <strong>acciones que no presenciaste directamente</strong>. Se usa para:</p>
                <ul>
                    <li><strong>Información de segunda mano</strong> (lo que te contaron)</li>
                    <li><strong>Rumores o chismes</strong></li>
                    <li><strong>Hechos que descubriste después</strong></li>
                    <li><strong>Noticias y reportes</strong></li>
                    <li><strong>Historias, cuentos y leyendas</strong></li>
                </ul>
                
                <h4>Formación básica</h4>
                <p><strong>Raíz del verbo</strong> + <strong>-mIş</strong> + <strong>sufijos personales</strong></p>
                
                <h4>Armonía vocálica para -mIş</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Última vocal</th>
                        <th>Sufijo</th>
                        <th>Ejemplo</th>
                    </tr>
                    <tr>
                        <td>a, ı</td>
                        <td>-mış</td>
                        <td>bak → <strong>bakmış</strong></td>
                    </tr>
                    <tr>
                        <td>e, i</td>
                        <td>-miş</td>
                        <td>gel → <strong>gelmiş</strong></td>
                    </tr>
                    <tr>
                        <td>o, u</td>
                        <td>-muş</td>
                        <td>oku → <strong>okumuş</strong></td>
                    </tr>
                    <tr>
                        <td>ö, ü</td>
                        <td>-müş</td>
                        <td>gör → <strong>görmüş</strong></td>
                    </tr>
                </table>
                
                <h4>Conjugación completa (verbo: gelmek - venir)</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pronombre</th>
                        <th>Forma</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>Ben</td>
                        <td><strong>gelmişim</strong></td>
                        <td>dicen que vine / parece que vine</td>
                    </tr>
                    <tr>
                        <td>Sen</td>
                        <td><strong>gelmişsin</strong></td>
                        <td>dicen que viniste</td>
                    </tr>
                    <tr>
                        <td>O</td>
                        <td><strong>gelmiş</strong></td>
                        <td>dicen que vino</td>
                    </tr>
                    <tr>
                        <td>Biz</td>
                        <td><strong>gelmişiz</strong></td>
                        <td>dicen que vinimos</td>
                    </tr>
                    <tr>
                        <td>Siz</td>
                        <td><strong>gelmişsiniz</strong></td>
                        <td>dicen que vinieron</td>
                    </tr>
                    <tr>
                        <td>Onlar</td>
                        <td><strong>gelmişler</strong> o <strong>gelmiş</strong></td>
                        <td>dicen que vinieron</td>
                    </tr>
                </table>
                
                <h4>Forma negativa</h4>
                <p>Se añade <strong>-me/-ma</strong> antes de -mIş:</p>
                <table class="comparison-table">
                    <tr>
                        <th>Positivo</th>
                        <th>Negativo</th>
                        <th>Traducción</th>
                    </tr>
                    <tr>
                        <td>gelmişim</td>
                        <td><strong>gelmemişim</strong></td>
                        <td>dicen que no vine</td>
                    </tr>
                    <tr>
                        <td>gelmiş</td>
                        <td><strong>gelmemiş</strong></td>
                        <td>dicen que no vino</td>
                    </tr>
                    <tr>
                        <td>yapmış</td>
                        <td><strong>yapmamış</strong></td>
                        <td>dicen que no hizo</td>
                    </tr>
                </table>
                
                <h4>Forma interrogativa</h4>
                <p>Se añade <strong>mi/mı/mu/mü</strong> después del sufijo personal:</p>
                <div class="example-box">
                    <p><strong>Gelmiş mi?</strong> — ¿Dicen que vino?</p>
                    <p><strong>Görmüş müsün?</strong> — ¿Parece que viste?</p>
                    <p><strong>Yapmışlar mı?</strong> — ¿Dicen que hicieron?</p>
                </div>
                
                <h4>Diferencia con el pasado simple (-DI vs. -mIş)</h4>
                <table class="comparison-table">
                    <tr>
                        <th>Pasado Simple (-DI)</th>
                        <th>Pasado Reportado (-mIş)</th>
                    </tr>
                    <tr>
                        <td><strong>Lo presenciaste</strong></td>
                        <td><strong>No lo presenciaste</strong></td>
                    </tr>
                    <tr>
                        <td>Experiencia directa</td>
                        <td>Información indirecta</td>
                    </tr>
                    <tr>
                        <td><em>Geldim</em><br/>(Vine - yo estaba allí)</td>
                        <td><em>Gelmişim</em><br/>(Dicen que vine - no lo recuerdo)</td>
                    </tr>
                    <tr>
                        <td><em>Ahmet geldi</em><br/>(Ahmet vino - lo vi)</td>
                        <td><em>Ahmet gelmiş</em><br/>(Dicen que Ahmet vino - me lo contaron)</td>
                    </tr>
                </table>
                
                <h4>Usos principales</h4>
                
                <h5>1. Información de segunda mano</h5>
                <div class="example-box">
                

                  `
                   }
                   };
    if (explanations[topic]) {
        title.textContent = explanations[topic].title;
        content.innerHTML = explanations[topic].content;
        modal.style.display = 'flex';
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('explanationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {

    // Agregar event listeners a los botones de explicación
    const explanationButtons = document.querySelectorAll('.explanation-btn');
    explanationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            if (topic) {
                openExplanation(topic);
            }
        });
    });

    // Agregar event listener al botón de cerrar modal
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Click fuera del modal para cerrar (movido a nivel de documento)
    document.getElementById('explanationModal').addEventListener('click', function(e) {
        if (e.target.id === 'explanationModal') {
            closeModal();
        }
    });

    // Efecto de botones (opcional, mantenido del original)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
        });
    });
});
