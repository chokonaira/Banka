import accountModel from '../models/accountModel';



export default class StaffController {
  static async ActivatOrDeactivateAccct(req, res) {
    try {
      const account = await accountModel.getAccount(req, res);
      if (account.length) {
        const updatedAccount = await accountModel.updateAccount(req, res);
        if (updatedAccount.length) {
          return res.status(200).send({
            status: 200,
            data: updatedAccount[0],
          });
        }
      }
      return null;
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  static async getAllAccounts(req, res) {
    try {
      const allAccounts = await accountModel.getAllAccounts(req, res);
      if (allAccounts.length) {
        return res.status(200).send({
          status: 200,
          data: allAccounts,
        });
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: 'Server Error, Please Try Again',
      });
    }
  }

  static async getUserAccounts(req, res) {
    try {
      const allAccounts = await accountModel.getAccountByEmail(req, res);
      if (allAccounts.length) {
        return res.status(200).send({
          status: 200,
          data: allAccounts,
        });
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: 'Unable to get all account details!! Server Error, Please Try Again',
      });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const isDeleted = await accountModel.delete(req, res);
      if (isDeleted > 0) {
        return res.status(200).send({
          status: 200,
          message: 'Seleted account successfully deleted',
        });
      }
      return null;
    } catch (error) {
      return res.status(500).send({
        status: 500,
        error: 'Account delete not completed!! Server Error, Please Try Again',
        message: error.message,
      });
    }
  } 
}
