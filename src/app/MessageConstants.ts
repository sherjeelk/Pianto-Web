import {ActivatedRoute} from '@angular/router';

export class MessageConstants {
  constructor(private route: ActivatedRoute) {
  }

  public static CURRENT_LANG = 1;
  public static EN_ERROR_MESSAGES = {
    BAD_REQ: '400 the request you sent is bad',
    UNAUTHORIZED_REQ: 'Unauthorised :Enter a valid email/password or login again',
    FORBIDDEN_REQ: '403 : You do not have rights to perform this action.',
    NOT_FOUND_REQ: '404 : Unable to find the requested item, not found.',
    NOT_ALLOWED_REQ: '405 : This operation is not allowed!',
    INTERNAL_SERVER_REQ: '500 : There is an error occurred while completing this request',
    BAD_GATEWAY_REQ: '502: Bad Gateway : There is an error occurred on server side',
    SERVICE_UNAVAILABLE_REQ: '503: Service Unavailable : Requested item is unavailable!',
    TIMEOUT_REQ: '504: Gateway Timeout : Request is taking too long!',
  };

  public static FI_ERROR_MESSAGES = {
    BAD_REQ: '400 lähettämäsi pyyntö on huono',
    UNAUTHORIZED_REQ: 'Luvaton: Anna kelvollinen sähköpostiosoite / salasana tai kirjaudu uudelleen',
    FORBIDDEN_REQ: '403: Sinulla ei ole oikeuksia suorittaa tätä toimintoa.',
    NOT_FOUND_REQ: '404: Pyydettyä tuotetta ei löydy, ei löydy.',
    NOT_ALLOWED_REQ: '405: Tätä toimintoa ei sallita!',
    INTERNAL_SERVER_REQ: '500: Pyyntöä täytettäessä tapahtui virhe',
    BAD_GATEWAY_REQ: '502: Virheellinen yhdyskäytävä: Palvelinpuolella tapahtui virhe',
    SERVICE_UNAVAILABLE_REQ: '503: Palvelu ei käytettävissä: Pyydetty tuote ei ole käytettävissä!',
    TIMEOUT_REQ: '504: Yhdyskäytävän aikakatkaisu: Pyyntö kestää liian kauan!',
  };

  public static getMessage(status, url) {
    if (status === 400) {
      if (!url.includes('payment-info')) {
        return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.BAD_REQ : MessageConstants.FI_ERROR_MESSAGES.BAD_REQ;
      }
    } else if (status === 401) {
      console.log('this is the error in interceptor', status);
      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.UNAUTHORIZED_REQ : MessageConstants.FI_ERROR_MESSAGES.UNAUTHORIZED_REQ;
    } else if (status === 403) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.FORBIDDEN_REQ : MessageConstants.FI_ERROR_MESSAGES.FORBIDDEN_REQ;
    } else if (status === 404) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.NOT_FOUND_REQ : MessageConstants.FI_ERROR_MESSAGES.NOT_FOUND_REQ;
    } else if (status === 405) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.NOT_ALLOWED_REQ : MessageConstants.FI_ERROR_MESSAGES.NOT_ALLOWED_REQ;
    } else if (status === 500) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.INTERNAL_SERVER_REQ : MessageConstants.FI_ERROR_MESSAGES.INTERNAL_SERVER_REQ;
    } else if (status === 502) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.BAD_GATEWAY_REQ : MessageConstants.FI_ERROR_MESSAGES.BAD_GATEWAY_REQ;
    } else if (status === 503) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.SERVICE_UNAVAILABLE_REQ : MessageConstants.FI_ERROR_MESSAGES.SERVICE_UNAVAILABLE_REQ;
    } else if (status === 504) {
      console.log('this is the error in interceptor', status);

      return MessageConstants.CURRENT_LANG === 1 ? MessageConstants.EN_ERROR_MESSAGES.TIMEOUT_REQ : MessageConstants.FI_ERROR_MESSAGES.TIMEOUT_REQ;
    } else {
      return 'An unknown error is occurred!';
    }
  }


  getRoute() {
    if (this.route) {

    }
  }

}





