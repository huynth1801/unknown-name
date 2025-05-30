import ApplicationConstants from "./ApplicationConstants"

const API_PATH = ApplicationConstants.API_PATH

class ResourceURL {
  // Authentication
  static RESET_PASSWORD = API_PATH + "/auth/password-reset/request"
  static CONFIRM_NEW_PASSWORD = API_PATH + "/auth/password-reset/confirm"
  static LOGIN = API_PATH + "/auth/log-in"
  static SIGN_UP = API_PATH + "/auth/register"
}

export default ResourceURL
