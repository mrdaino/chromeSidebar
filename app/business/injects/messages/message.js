/**
 * Created by Lorenzo Daneo.
 * mail to lorenzo.daneo@coolsholp.it
 */
const MESSAGE_WAITING_RESPONSE = "MESSAGE_WAITING_RESPONSE";

var Message = function(type,content){

    this.type = type;
    this.content = content;

    this.status = null;

};