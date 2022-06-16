export class AppConstants {
  constructor() {
  }
  public static G_ID = 'G-5EV6DJE1RX';

  // Production keys
  //
  public static BASE_URL = 'https://api.pianto.io';
  
  public static PAY_TRAIL_AUTH = 'vhAGKTvHGzrkpe95RpU5SqerrKzznE';
  public static PAY_TRAIL_MER_ID = '62160';
  
  
  public static PAY_TRAIL_SUCCESS = 'https://tilaus.pianto.io/payment-info/success';
  public static PAY_TRAIL_FAILED = 'https://tilaus.pianto.io/payment-info/fail';
  
  
  public static PAY_TRAIL_SUCCESS_EXT = 'https://tilaus.pianto.io/ext-payment-info/success';
  public static PAY_TRAIL_FAILED_EXT = 'https://tilaus.pianto.io/ext-payment-info/fail';


  // Test Keys

  // public static BASE_URL = 'https://test-api.pianto.io';

  // public static PAY_TRAIL_AUTH = '6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ';
  // public static PAY_TRAIL_MER_ID = '13466';


  // public static PAY_TRAIL_SUCCESS = 'https://test-tilaus.pianto.io/payment-info/success';
  // public static PAY_TRAIL_FAILED = 'https://test-tilaus.pianto.io/payment-info/fail';

  // public static PAY_TRAIL_SUCCESS_EXT = 'https://test-tilaus.pianto.io/ext-payment-info/success';
  // public static PAY_TRAIL_FAILED_EXT = 'https://test-tilaus.pianto.io/ext-payment-info/fail';


  // Static Urls

  public static API = {
    LOGIN: AppConstants.BASE_URL + '/v1/auth/login',
    REGISTER: AppConstants.BASE_URL + '/v1/auth/register',
    FORGOT: AppConstants.BASE_URL + '/v1/auth/forgot-password',
    NEW_PASSWORD: AppConstants.BASE_URL + '/v1/auth/reset-password',
    All_USERS: AppConstants.BASE_URL + '/v1/users',
    All_SETTINGS: AppConstants.BASE_URL + '/v1/settings',
    All_SERVICES: AppConstants.BASE_URL + '/v1/services',
    All_COUPONS: AppConstants.BASE_URL + '/v1/coupons',
    All_ORDERS: AppConstants.BASE_URL + '/v1/orders',
    MY_ORDERS: AppConstants.BASE_URL + '/v1/orders/me',
    CANCEL_ORDER: AppConstants.BASE_URL + '/v1/orders/cancel',
    PLACE_ORDERS: AppConstants.BASE_URL + '/v1/orders/place',
    CONFIRM_ORDERS: AppConstants.BASE_URL + '/v1/orders/confirm',
    All_PRICING: AppConstants.BASE_URL + '/v1/pricing',
    All_CHARGES: AppConstants.BASE_URL + '/v1/charges',
    All_EXTRAS: AppConstants.BASE_URL + '/v1/extras',
    SILENT_REGISTER: AppConstants.BASE_URL + '/v1/auth/registerSilent',
    APPLY_COUPON: AppConstants.BASE_URL + '/v1/coupons/applyCoupon',
    ALL_SLOTS: AppConstants.BASE_URL + '/v1/services/slots',
    FUTURE_SLOTS: AppConstants.BASE_URL + '/v1/services/futureSlots',
    EXT_ORDER: AppConstants.BASE_URL + '/v1/orders/ext',
    All_REVIEWS: AppConstants.BASE_URL + '/v1/reviews',
  };

}
