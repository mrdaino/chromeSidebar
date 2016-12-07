/**
 * Created by Lorenzo Daneo.
 * mail to lorenzo.daneo@coolsholp.it
 */

const SIDEBAR_INIT_HEIGHT = 200,
    SIDEBAR_INIT_WIDTH = 200,
    SIDEBAR_MIN_HEIGHT = 30,
    SIDEBAR_MIN_WIDTH = 30,
    SIDEBAR_ACTION_INIT = "ACTION_INIT",
    SIDEBAR_ACTION_OPEN = "ACTION_OPEN",
    SIDEBAR_ACTION_CLOSE = "ACTION_CLOSE",
    SIDEBAR_POSITION_BOTTOM = 'bottom',
    SIDEBAR_POSITION_RIGHT = 'right',
    SIDEBAR_MOUSE_ON = 'ON',
    SIDEBAR_MOUSE_OFF = 'OFF';

/**
 * questo oggetto JSON-able viene scambiato tra chrome extension
 * e content_scripts in pagina per mantenere sempre la situazione
 * aggiornata tra i controller
 */
var SidebarOptions = function () {

    this.inited = false;  //indica se è già stata inizializzata

    this.action = SIDEBAR_ACTION_INIT;  // azione da lanciare all'evento
                                        // il controller fa l'azione e imposta
                                        // subito l'azione successiva

    this.open = false;   // indica se la sidebar è aperta nel moment corrente

    this.height = SIDEBAR_INIT_HEIGHT;  // altezza della sidebar
                                        // usata se position = SIDEBAR_POSITION_BOTTOM

    this.width = SIDEBAR_INIT_WIDTH;    // larghezza della sidebar
                                        // usata se position = SIDEBAR_POSITION_LEFT

    this.parentHeight = null;   // altezza della window

    this.parentWidth = null;    // larghezza della window

    this.position = SIDEBAR_POSITION_BOTTOM;  // posizione della sidebar

    this.mouse = null;    // valorizzato per determinare se sono sopra alla sidebar o no

};