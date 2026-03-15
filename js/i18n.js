/* ═══════════════════════════════════════════════════════
   BWV 565 · Musical Representations · i18n.js
   Bilingual ES / EN translation module
   ═══════════════════════════════════════════════════════ */
'use strict';

window.I18N = (() => {
  let _lang = localStorage.getItem('lang') || 'es';

  const T = {
    /* ─────────────────────────────── ESPAÑOL ─── */
    es: {
      // Header
      'header.about':   'acerca de',
      'header.tagline': 'La nota inicial en <strong>19 representaciones</strong> distintas',
      'header.author':  'Idea original de <a href="https://www.jlmirall.es" target="_blank" rel="noopener">José Luis Miralles Bono</a>',
      'header.github':  '↗ Repositorio en GitHub',
      'header.kofi':    '☕ Invitar a una horchata',
      'header.credit':  'Realizado con Claude',

      // Axis navigation
      'axis.title':              'del sonido a sus modos de inscripción',
      'axis.branch.reading':     'lectura',
      'axis.branch.performance': 'ejecución · procesamiento',
      'axis.aria':               'Representaciones musicales',

      // Category filter buttons
      'cat.sonido':   'sonido',
      'cat.senal':    'señal',
      'cat.partitura':'partitura',
      'cat.evento':   'evento',
      'cat.fuente':   'fuente',
      'cat.codigo':   'código',
      'cat.braille':  'braille',

      // Category badges (uppercase)
      'badge.sonido':   'SONIDO',
      'badge.senal':    'SEÑAL',
      'badge.partitura':'PARTITURA',
      'badge.evento':   'EVENTO',
      'badge.fuente':   'FUENTE',
      'badge.codigo':   'CÓDIGO',
      'badge.braille':  'BRAILLE',

      // Section titles
      's01.title': 'Audio',
      's02.title': 'Forma de onda',
      's03.title': 'Espectrograma',
      's04.title': 'Manuscrito',
      's05.title': 'PDF escaneado',
      's06.title': 'PDF vectorial',
      's07.title': 'PNG Raster',
      's08.title': 'SVG',
      's09.title': 'MIDI literal',
      's10.title': 'MIDI interpretado',
      's11.title': 'MSCZ',
      's12.title': 'MXL',
      's13.title': 'MusicXML',
      's14.title': 'LilyPond',
      's15.title': 'ABC Music',
      's16.title': 'MEI',
      's17.title': 'Humdrum /**kern',
      's18.title': 'Musedata',
      's19.title': 'Braille Musical',

      // Explanation summary
      'explain.summary': 'Explicación',

      // Download buttons
      's01.download': '↓ Descargar .WAV',
      's04.download': '↓ Descargar manuscrito',
      's05.download': '↓ Descargar PDF escaneado',
      's06.download': '↓ Descargar PDF vectorial',
      's07.download': '↓ Descargar .PNG',
      's08.download': '↓ Descargar .SVG',
      's09.download': '↓ Descargar MIDI literal',
      's10.download': '↓ Descargar MIDI interpretado',
      's11.download': '↓ Descargar .MSCZ',
      's12.download': '↓ Descargar .MXL',
      's13.download': '↓ Descargar .musicxml',
      's14.download': '↓ Descargar .ly',
      's15.download': '↓ Descargar .abc',
      's16.download': '↓ Descargar .mei',
      's17.download': '↓ Descargar .krn',
      's18.download': '↓ Descargar .musedata',
      's19.download': '↓ Descargar .txt (Unicode Braille)',

      // Tool links
      'tool.openin': 'Abrir en',
      'tool.tool':   'Herramienta',

      // Player
      'player.piece':     'BWV 565 · A mordente',
      'player.playpause': 'Reproducir/Pausar',

      // Footer
      'footer.main': 'Johann Sebastian Bach · <em>Toccata und Fuge d-Moll</em> · BWV 565 · c. 1703–1707',
      'footer.note': 'Mordant d-Moll · <a href="https://www.jlmirall.es" target="_blank" rel="noopener">José Luis Miralles Bono</a> · Realizado con Claude',

      // Metadata keys (dt)
      'meta.formato':           'Formato',
      'meta.duracion':          'Duración',
      'meta.tamano':            'Tamaño',
      'meta.estandar':          'Estándar abierto',
      'meta.ejeX':              'Eje X',
      'meta.ejeY':              'Eje Y',
      'meta.canal':             'Canal mostrado',
      'meta.novisible':         'Información no visible',
      'meta.metodo':            'Método',
      'meta.ventana':           'Tamaño de ventana',
      'meta.hop':               'Salto (hop)',
      'meta.resolFreq':         'Resolución frecuencial',
      'meta.fotogramas':        'Fotogramas totales',
      'meta.fundamental':       'Nota fundamental',
      'meta.fuente':            'Fuente',
      'meta.institucion':       'Institución',
      'meta.copista':           'Copista',
      'meta.fecha':             'Fecha de copia',
      'meta.titulo':            'Título original',
      'meta.rism':              'Catálogo RISM',
      'meta.edicion':           'Edición',
      'meta.editor':            'Editor',
      'meta.editorial':         'Editorial',
      'meta.copyright':         'Copyright',
      'meta.resolucion':        'Resolución',
      'meta.compresion':        'Compresión interna',
      'meta.limitaciones':      'Limitaciones',
      'meta.generado':          'Generado con',
      'meta.fuenteMusical':     'Fuente musical',
      'meta.escalabilidad':     'Escalabilidad',
      'meta.ventaja':           'Ventaja frente al ráster',
      'meta.tipo':              'Tipo',
      'meta.origen':            'Origen',
      'meta.uso':               'Uso',
      'meta.limitacion':        'Limitación',
      'meta.contenedor':        'Contenedor',
      'meta.contenidoPrincipal':'Contenido principal',
      'meta.tamanoTotal':       'Tamaño total',
      'meta.portabilidad':      'Portabilidad',
      'meta.contenido':         'Contenido',
      'meta.pistas':            'Pistas',
      'meta.ticksBeat':         'Ticks/beat',
      'meta.tempo':             'Tempo',
      'meta.nota':              'Nota',
      'meta.estandarSolo':      'Estándar',
      'meta.tracks':            'Tracks',
      'meta.notas':             'Notas',
      'meta.version':           'Versión',
      'meta.compilacion':       'Compilación',
      'meta.licencia':          'Licencia',
      'meta.comunidades':       'Comunidades',
      'meta.herramientas':      'Herramientas',
      'meta.mantenido':         'Mantenido por',
      'meta.difVsMusicXML':     'Diferencia vs MusicXML',
      'meta.creador':           'Creador',
      'meta.repositorio':       'Repositorio',
      'meta.sintaxis':          'Sintaxis de nota',
      'meta.colecciones':       'Colecciones',
      'meta.estado':            'Estado',
      'meta.acceso':            'Acceso',
      'meta.celulas':           'Células base',
      'meta.lectura':           'Lectura',

      // Metadata values (translatable dd)
      'meta.val.siIBM':            'Sí (IBM/Microsoft, 1991)',
      'meta.val.canalIzq':         'Izquierdo · 92.160 muestras',
      'meta.val.novisible':        'Altura, timbre, estructura armónica',
      'meta.val.limitaciones':     'No editable, no accesible, artefactos de escaneo',
      'meta.val.infinita':         'Infinita · sin pérdida de calidad',
      'meta.val.ventaja7x':        '7× más pequeño · sin artefactos · editable en origen',
      'meta.val.usoWeb':           'Web, documentos, presentaciones',
      'meta.val.limitacionPNG':    'Resolución fija · pixelado al ampliar',
      'meta.val.ventajaSVG':       'Escalable · editable · manipulable con CSS/JS',
      'meta.val.portabilidadMSCZ': 'Solo MuseScore (aunque el XML interno es legible)',
      'meta.val.siW3C':            'Sí (W3C Music Notation)',
      'meta.val.dominioPublico':   'Dominio público (edición Urtext)',
      'meta.val.folk':             'Música folk, tradicional, sesiones',
      'meta.val.difMEI':           'Orientado a edición crítica, no solo intercambio',
      'meta.val.usoKern':          'Análisis musical computacional, musicología',
      'meta.val.legado':           'Legado (reemplazado por MusicXML), pero corpus activo',
      'meta.val.lecturaBraille':   'Táctil, lineal, voz por voz',

      // UI loading / error strings
      'ui.loading.samples':  'Cargando muestras…',
      'ui.loading':          'Cargando…',
      'ui.loading.spec':     'Calculando espectrograma…',
      'ui.loading.specInfo': 'Calculando…',
      'ui.loading.pdf':      'Cargando...',
      'ui.loading.png':      'Cargando PNG…',
      'ui.httpOnly':         'Disponible solo con servidor HTTP.',
      'ui.errorPDF':         'Error al cargar el PDF.',
      'ui.errorImg':         'Error al cargar la imagen.',
      'ui.noHTTP':           '(No disponible en file://; abre con un servidor HTTP)',
      'ui.noHTTPPages':      '(No disponible en file://; abre con un servidor HTTP o GitHub Pages)',
      'ui.noHTTPMIDI':       '(No disponible; abre con un servidor HTTP o en GitHub Pages)',

      // Waveform controls
      'wf.hint':       'rueda para zoom · arrastra para desplazar',
      'wf.title.out':  'Alejar',
      'wf.title.in':   'Acercar',
      'wf.title.yin':  'Zoom vertical: acercar',
      'wf.title.yout': 'Zoom vertical: alejar',
      // Waveform dynamic text
      'wf.sampleMode': ' · modo muestra individual',
      'wf.samples':    'Muestras',
      'wf.visible':    'visibles',

      // Spectrogram controls
      'spec.hint':       'rueda para zoom temporal · arrastra para desplazar',
      'spec.title.out':  'Alejar (tiempo)',
      'spec.title.in':   'Acercar (tiempo)',
      'spec.title.fin':  'Zoom frecuencia: acercar',
      'spec.title.fout': 'Zoom frecuencia: alejar',
      // Spectrogram dynamic
      'spec.frames': 'fotogramas',

      // Scan/vector/PNG hints & infos
      'scan.hint0':  'clic → mordente',
      'scan.hint1':  'clic → píxeles',
      'scan.hint2':  'clic → vista completa',
      'scan.info0':  'Vista completa · PDF escaneado · haz clic para ampliar el mordente inicial',
      'scan.info1':  'Ampliación · mordente inicial — Re con Mordant · haz clic para ver los píxeles',
      'scan.info2':  'Píxeles del escáner · naturaleza ráster del archivo · haz clic para volver',
      'vec.hint0':   'clic → mordente',
      'vec.hint1':   'clic → detalle vectorial',
      'vec.hint2':   'clic → vista completa',
      'vec.info0':   'Vista completa · PDF vectorial · haz clic para ampliar el mordente inicial',
      'vec.info1':   'Ampliación · mordente inicial — La con Mordant · haz clic para ver el detalle vectorial',
      'vec.info2':   'Detalle vectorial · curvas perfectas sin píxeles · haz clic para volver',
      'png.hint0':   'clic → ver píxeles',
      'png.hint1':   'clic → vista completa',
      'png.info0':   'Vista completa · PNG exportado por LilyPond 2.24.4 · haz clic para ampliar',
      'png.info1':   'Píxeles del PNG · aliasing en bordes de líneas · haz clic para volver',
      'scan.infoInit': 'Vista completa · haz clic para ampliar el mordente inicial',
      'vec.infoInit':  'Vista completa · haz clic para ampliar el mordente inicial',
      'png.infoInit':  'Vista completa · PNG exportado por MuseScore 4 · haz clic para ampliar',

      // MSCZ explorer
      'mscz.title':          'Estructura interna (ZIP)',
      'mscz.select':         '← selecciona un archivo',
      'mscz.xmlScore':       'XML de partitura',
      'mscz.visualStyle':    'Estilo visual',
      'mscz.thumbnail':      'Miniatura',
      'mscz.audioConfig':    'Config audio',
      'mscz.viewConfig':     'Config vista',
      'mscz.manifest':       'Manifiesto ZIP',
      'mscz.lines':          'primeras',
      'mscz.of':             'de',
      'mscz.linesUnit':      'líneas',
      'mscz.notesHl':        'nota',
      'mscz.notesHlPl':      'notas',
      'mscz.notesHlSuffix':  'resaltada',
      'mscz.notesHlSuffixPl':'resaltadas',

      // MXL
      'mxl.note':  'El archivo .mxl (2.1 KB) es 4.6× más pequeño que el .musicxml descomprimido (9.7 KB)',
      'mxl.score': 'MusicXML completo',
      'mxl.meta':  'Apunta al XML principal',

      // MusicXML highlight buttons
      'xml.hl.notas':         'notas',
      'xml.hl.apariencia':    'apariencia',
      'xml.hl.meta':          'metadatos',
      'xml.hl.instrumento':   'instrumento',
      'xml.hl.atributos':     'atributos',
      'xml.hl.indicaciones':  'indicaciones',
      'xml.stats.base':       'De las 312 líneas: 33% notas · 63% metadato/apariencia/config',

      // LilyPond
      'ly.stats': 'Las dos voces del mordente inicial (mano derecha + tenor)',

      // ABC
      'abc.stats': 'La nota con adorno en ambas voces (A4 y A3)',

      // MEI
      'mei.stats': 'A5, corchea, plico arriba (Manuale I, voz 1)',

      // Kern
      'kern.stats': 'A4 + A5 · corchea · calderón · mordente (dos spines)',

      // MIDI tabs & hex bar
      'midi.tab.hex':    'Volcado hex',
      'midi.tab.events': 'Eventos SMF',
      'midi.hl.label':   'resaltar:',

      // MIDI byte table (section 09)
      'midi.th.byte':    'Byte',
      'midi.th.hex':     'Hex',
      'midi.th.field':   'Campo',
      'midi.th.meaning': 'Significado',
      'midi.row.delta':  'Delta time (Δt)',
      'midi.row.status': 'Status byte',
      'midi.row.noteid': 'Número de nota',
      'midi.row.veloc':  'Velocity',
      'midi.val.delta':  '0 ticks desde el evento anterior → suena inmediatamente',
      'midi.val.status': 'Nibble alto <code>9</code> = note_on · nibble bajo <code>0</code> = canal 1',
      'midi.val.noteid': '81 decimal = A5 (La, 880 Hz) · fórmula: 12×(oct+1)+semitono',
      'midi.val.veloc':  '90 decimal ≈ 71 % del máximo 127 · codifica la intensidad',

      // SVG layer demo labels
      'svg.layer1': '① Pentagrama',
      'svg.layer2': '② Línea auxiliar',
      'svg.layer3': '③ Cabeza de nota',
      'svg.layer4': '④ Plica',
      'svg.layer5': '⑤ Mordant',

      // Braille section
      'braille.voice.upper':  'Voz superior (A5)',
      'braille.voice.lower':  'Voz inferior (A4)',
      'braille.th.symbol':    'Símbolo',
      'braille.th.dots':      'Puntos',
      'braille.th.meaning':   'Significado',
      'braille.trebleClef':   'Clave de Sol',
      'braille.keySig':       'Armadura: 1 bemol',
      'braille.timeSig':      'Compás 4/4',
      'braille.oct5':         'Marca octava 5ª (C5–B5)',
      'braille.oct4':         'Marca octava 4ª (C4–B4)',
      'braille.mordent':      'Mordente',
      'braille.noteA':        'La (A) — corchea ♪',
      'braille.fermata':      'Calderón (fermata)',
      'braille.rest8':        'Silencio de corchea',
      'braille.rest4':        'Silencio de negra',
      'braille.rest2':        'Silencio de blanca',

      // MIDI parse error
      'midi.parseError': 'Error al parsear',

      // Score render error
      'ui.errorScore': 'Error al renderizar la partitura.',

      // Waveform tooltip locale
      'locale': 'es',
    },

    /* ─────────────────────────────── ENGLISH ─── */
    en: {
      // Header
      'header.about':   'about',
      'header.tagline': 'The opening note in <strong>19 representations</strong>',
      'header.author':  'Original concept by <a href="https://www.jlmirall.es" target="_blank" rel="noopener">José Luis Miralles Bono</a>',
      'header.github':  '↗ Repository on GitHub',
      'header.kofi':    '☕ Buy me a coffee',
      'header.credit':  'Made with Claude',

      // Axis navigation
      'axis.title':              'from sound to its modes of inscription',
      'axis.branch.reading':     'reading',
      'axis.branch.performance': 'performance · processing',
      'axis.aria':               'Musical representations',

      // Category filter buttons
      'cat.sonido':   'sound',
      'cat.senal':    'signal',
      'cat.partitura':'score',
      'cat.evento':   'event',
      'cat.fuente':   'source',
      'cat.codigo':   'code',
      'cat.braille':  'braille',

      // Category badges (uppercase)
      'badge.sonido':   'SOUND',
      'badge.senal':    'SIGNAL',
      'badge.partitura':'SCORE',
      'badge.evento':   'EVENT',
      'badge.fuente':   'SOURCE',
      'badge.codigo':   'CODE',
      'badge.braille':  'BRAILLE',

      // Section titles
      's01.title': 'Audio',
      's02.title': 'Waveform',
      's03.title': 'Spectrogram',
      's04.title': 'Manuscript',
      's05.title': 'Scanned PDF',
      's06.title': 'Vector PDF',
      's07.title': 'PNG Raster',
      's08.title': 'SVG',
      's09.title': 'Literal MIDI',
      's10.title': 'Interpreted MIDI',
      's11.title': 'MSCZ',
      's12.title': 'MXL',
      's13.title': 'MusicXML',
      's14.title': 'LilyPond',
      's15.title': 'ABC Music',
      's16.title': 'MEI',
      's17.title': 'Humdrum /**kern',
      's18.title': 'Musedata',
      's19.title': 'Music Braille',

      // Explanation summary
      'explain.summary': 'Explanation',

      // Download buttons
      's01.download': '↓ Download .WAV',
      's04.download': '↓ Download manuscript',
      's05.download': '↓ Download scanned PDF',
      's06.download': '↓ Download vector PDF',
      's07.download': '↓ Download .PNG',
      's08.download': '↓ Download .SVG',
      's09.download': '↓ Download literal MIDI',
      's10.download': '↓ Download interpreted MIDI',
      's11.download': '↓ Download .MSCZ',
      's12.download': '↓ Download .MXL',
      's13.download': '↓ Download .musicxml',
      's14.download': '↓ Download .ly',
      's15.download': '↓ Download .abc',
      's16.download': '↓ Download .mei',
      's17.download': '↓ Download .krn',
      's18.download': '↓ Download .musedata',
      's19.download': '↓ Download .txt (Unicode Braille)',

      // Tool links
      'tool.openin': 'Open in',
      'tool.tool':   'Tool',

      // Player
      'player.piece':     'BWV 565 · A mordent',
      'player.playpause': 'Play/Pause',

      // Footer
      'footer.main': 'Johann Sebastian Bach · <em>Toccata und Fuge d-Moll</em> · BWV 565 · c. 1703–1707',
      'footer.note': 'Mordant d-Moll · <a href="https://www.jlmirall.es" target="_blank" rel="noopener">José Luis Miralles Bono</a> · Made with Claude',

      // Metadata keys (dt)
      'meta.formato':           'Format',
      'meta.duracion':          'Duration',
      'meta.tamano':            'Size',
      'meta.estandar':          'Open standard',
      'meta.ejeX':              'X axis',
      'meta.ejeY':              'Y axis',
      'meta.canal':             'Channel shown',
      'meta.novisible':         'Not visible information',
      'meta.metodo':            'Method',
      'meta.ventana':           'Window size',
      'meta.hop':               'Hop size',
      'meta.resolFreq':         'Frequency resolution',
      'meta.fotogramas':        'Total frames',
      'meta.fundamental':       'Fundamental note',
      'meta.fuente':            'Source',
      'meta.institucion':       'Institution',
      'meta.copista':           'Copyist',
      'meta.fecha':             'Date of copy',
      'meta.titulo':            'Original title',
      'meta.rism':              'RISM catalogue',
      'meta.edicion':           'Edition',
      'meta.editor':            'Editor',
      'meta.editorial':         'Publisher',
      'meta.copyright':         'Copyright',
      'meta.resolucion':        'Resolution',
      'meta.compresion':        'Internal compression',
      'meta.limitaciones':      'Limitations',
      'meta.generado':          'Generated with',
      'meta.fuenteMusical':     'Music font',
      'meta.escalabilidad':     'Scalability',
      'meta.ventaja':           'Advantage over raster',
      'meta.tipo':              'Type',
      'meta.origen':            'Origin',
      'meta.uso':               'Use',
      'meta.limitacion':        'Limitation',
      'meta.contenedor':        'Container',
      'meta.contenidoPrincipal':'Main content',
      'meta.tamanoTotal':       'Total size',
      'meta.portabilidad':      'Portability',
      'meta.contenido':         'Contents',
      'meta.pistas':            'Tracks',
      'meta.ticksBeat':         'Ticks/beat',
      'meta.tempo':             'Tempo',
      'meta.nota':              'Note',
      'meta.estandarSolo':      'Standard',
      'meta.tracks':            'Tracks',
      'meta.notas':             'Notes',
      'meta.version':           'Version',
      'meta.compilacion':       'Compilation',
      'meta.licencia':          'License',
      'meta.comunidades':       'Communities',
      'meta.herramientas':      'Tools',
      'meta.mantenido':         'Maintained by',
      'meta.difVsMusicXML':     'Difference vs MusicXML',
      'meta.creador':           'Creator',
      'meta.repositorio':       'Repository',
      'meta.sintaxis':          'Note syntax',
      'meta.colecciones':       'Collections',
      'meta.estado':            'Status',
      'meta.acceso':            'Access',
      'meta.celulas':           'Base cells',
      'meta.lectura':           'Reading',

      // Metadata values (translatable dd)
      'meta.val.siIBM':            'Yes (IBM/Microsoft, 1991)',
      'meta.val.canalIzq':         'Left · 92,160 samples',
      'meta.val.novisible':        'Pitch, timbre, harmonic structure',
      'meta.val.limitaciones':     'Non-editable, non-accessible, scan artifacts',
      'meta.val.infinita':         'Infinite · lossless quality',
      'meta.val.ventaja7x':        '7× smaller · no artifacts · editable at source',
      'meta.val.usoWeb':           'Web, documents, presentations',
      'meta.val.limitacionPNG':    'Fixed resolution · pixelated when zoomed',
      'meta.val.ventajaSVG':       'Scalable · editable · manipulable with CSS/JS',
      'meta.val.portabilidadMSCZ': 'MuseScore only (though internal XML is readable)',
      'meta.val.siW3C':            'Yes (W3C Music Notation)',
      'meta.val.dominioPublico':   'Public domain (Urtext edition)',
      'meta.val.folk':             'Folk, traditional, session music',
      'meta.val.difMEI':           'Oriented to critical editions, not just interchange',
      'meta.val.usoKern':          'Computational music analysis, musicology',
      'meta.val.legado':           'Legacy (superseded by MusicXML), but active corpus',
      'meta.val.lecturaBraille':   'Tactile, linear, voice by voice',

      // UI loading / error strings
      'ui.loading.samples':  'Loading samples…',
      'ui.loading':          'Loading…',
      'ui.loading.spec':     'Computing spectrogram…',
      'ui.loading.specInfo': 'Computing…',
      'ui.loading.pdf':      'Loading...',
      'ui.loading.png':      'Loading PNG…',
      'ui.httpOnly':         'Only available with HTTP server.',
      'ui.errorPDF':         'Error loading PDF.',
      'ui.errorImg':         'Error loading image.',
      'ui.noHTTP':           '(Not available in file://; open with an HTTP server)',
      'ui.noHTTPPages':      '(Not available in file://; open with an HTTP server or GitHub Pages)',
      'ui.noHTTPMIDI':       '(Not available; open with an HTTP server or on GitHub Pages)',

      // Waveform controls
      'wf.hint':       'scroll to zoom · drag to pan',
      'wf.title.out':  'Zoom out',
      'wf.title.in':   'Zoom in',
      'wf.title.yin':  'Vertical zoom in',
      'wf.title.yout': 'Vertical zoom out',
      // Waveform dynamic text
      'wf.sampleMode': ' · individual sample mode',
      'wf.samples':    'Samples',
      'wf.visible':    'visible',

      // Spectrogram controls
      'spec.hint':       'scroll to zoom · drag to pan',
      'spec.title.out':  'Zoom out (time)',
      'spec.title.in':   'Zoom in (time)',
      'spec.title.fin':  'Frequency zoom in',
      'spec.title.fout': 'Frequency zoom out',
      // Spectrogram dynamic
      'spec.frames': 'frames',

      // Scan/vector/PNG hints & infos
      'scan.hint0':  'click → mordent',
      'scan.hint1':  'click → pixels',
      'scan.hint2':  'click → full view',
      'scan.info0':  'Full view · scanned PDF · click to zoom in on the opening mordent',
      'scan.info1':  'Zoom · opening mordent — D with Mordant · click to see pixels',
      'scan.info2':  'Scanner pixels · raster nature of the file · click to go back',
      'vec.hint0':   'click → mordent',
      'vec.hint1':   'click → vector detail',
      'vec.hint2':   'click → full view',
      'vec.info0':   'Full view · vector PDF · click to zoom in on the opening mordent',
      'vec.info1':   'Zoom · opening mordent — A with Mordant · click to see vector detail',
      'vec.info2':   'Vector detail · perfect curves, no pixels · click to go back',
      'png.hint0':   'click → see pixels',
      'png.hint1':   'click → full view',
      'png.info0':   'Full view · PNG exported by LilyPond 2.24.4 · click to zoom in',
      'png.info1':   'PNG pixels · aliasing on line edges · click to go back',
      'scan.infoInit': 'Full view · click to zoom in on the opening mordent',
      'vec.infoInit':  'Full view · click to zoom in on the opening mordent',
      'png.infoInit':  'Full view · PNG exported by MuseScore 4 · click to zoom in',

      // MSCZ explorer
      'mscz.title':          'Internal structure (ZIP)',
      'mscz.select':         '← select a file',
      'mscz.xmlScore':       'Score XML',
      'mscz.visualStyle':    'Visual style',
      'mscz.thumbnail':      'Thumbnail',
      'mscz.audioConfig':    'Audio config',
      'mscz.viewConfig':     'View config',
      'mscz.manifest':       'ZIP manifest',
      'mscz.lines':          'first',
      'mscz.of':             'of',
      'mscz.linesUnit':      'lines',
      'mscz.notesHl':        'note',
      'mscz.notesHlPl':      'notes',
      'mscz.notesHlSuffix':  'highlighted',
      'mscz.notesHlSuffixPl':'highlighted',

      // MXL
      'mxl.note':  'The .mxl file (2.1 KB) is 4.6× smaller than the uncompressed .musicxml (9.7 KB)',
      'mxl.score': 'Full MusicXML',
      'mxl.meta':  'Points to main XML',

      // MusicXML highlight buttons
      'xml.hl.notas':         'notes',
      'xml.hl.apariencia':    'appearance',
      'xml.hl.meta':          'metadata',
      'xml.hl.instrumento':   'instrument',
      'xml.hl.atributos':     'attributes',
      'xml.hl.indicaciones':  'directions',
      'xml.stats.base':       'Of 312 lines: 33% notes · 63% metadata/appearance/config',

      // LilyPond
      'ly.stats': 'The two voices of the opening mordent (right hand + tenor)',

      // ABC
      'abc.stats': 'The ornamented note in both voices (A4 and A3)',

      // MEI
      'mei.stats': 'A5, eighth note, stem up (Manual I, voice 1)',

      // Kern
      'kern.stats': 'A4 + A5 · eighth note · fermata · mordent (two spines)',

      // MIDI tabs & hex bar
      'midi.tab.hex':    'Hex dump',
      'midi.tab.events': 'SMF events',
      'midi.hl.label':   'highlight:',

      // MIDI byte table (section 09)
      'midi.th.byte':    'Byte',
      'midi.th.hex':     'Hex',
      'midi.th.field':   'Field',
      'midi.th.meaning': 'Meaning',
      'midi.row.delta':  'Delta time (Δt)',
      'midi.row.status': 'Status byte',
      'midi.row.noteid': 'Note number',
      'midi.row.veloc':  'Velocity',
      'midi.val.delta':  '0 ticks from previous event → sounds immediately',
      'midi.val.status': 'High nibble <code>9</code> = note_on · low nibble <code>0</code> = channel 1',
      'midi.val.noteid': '81 decimal = A5 (A, 880 Hz) · formula: 12×(oct+1)+semitone',
      'midi.val.veloc':  '90 decimal ≈ 71% of max 127 · encodes intensity',

      // SVG layer demo labels
      'svg.layer1': '① Staff',
      'svg.layer2': '② Ledger line',
      'svg.layer3': '③ Notehead',
      'svg.layer4': '④ Stem',
      'svg.layer5': '⑤ Mordant',

      // Braille section
      'braille.voice.upper':  'Upper voice (A5)',
      'braille.voice.lower':  'Lower voice (A4)',
      'braille.th.symbol':    'Symbol',
      'braille.th.dots':      'Dots',
      'braille.th.meaning':   'Meaning',
      'braille.trebleClef':   'Treble clef',
      'braille.keySig':       'Key signature: 1 flat',
      'braille.timeSig':      'Time signature 4/4',
      'braille.oct5':         'Octave mark 5 (C5–B5)',
      'braille.oct4':         'Octave mark 4 (C4–B4)',
      'braille.mordent':      'Mordent',
      'braille.noteA':        'A — eighth note ♪',
      'braille.fermata':      'Fermata',
      'braille.rest8':        'Eighth rest',
      'braille.rest4':        'Quarter rest',
      'braille.rest2':        'Half rest',

      // MIDI parse error
      'midi.parseError': 'Parse error',

      // Score render error
      'ui.errorScore': 'Error rendering the score.',

      // Locale for number formatting
      'locale': 'en',
    },
  };

  /* ── Helpers ──────────────────────────────────────── */
  function t(key) {
    return T[_lang]?.[key] ?? T.es[key] ?? key;
  }

  /* ── Apply translations to DOM ───────────────────── */
  function applyLang() {
    document.documentElement.lang = _lang;

    const btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = _lang === 'es' ? 'EN' : 'ES';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = t(el.dataset.i18nHtml);
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const v = t(el.dataset.i18nTitle);
      if (v != null) el.title = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = t(el.dataset.i18nAria);
      if (v != null) el.setAttribute('aria-label', v);
    });

    // Toggle language-specific content blocks
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.hidden = el.dataset.lang !== _lang;
    });
  }

  /* ── Public API ───────────────────────────────────── */
  function setLang(lang) {
    _lang = lang;
    localStorage.setItem('lang', lang);
    applyLang();
  }

  function getLang() { return _lang; }

  return { t, setLang, getLang, applyLang };
})();
