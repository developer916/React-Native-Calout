import * as ActionTypes from './ActionTypes';

export const login = (email, password, authToken, role, userId, company,  name, companyId) => {
    return {
        type: ActionTypes.LOGIN,
        email: email,
        password: password,
        authToken: authToken,
        role: role,
        userId: userId,
        company: company,
        name: name,
        companyId: companyId,
    };
};

export const register = (name, email, password,  userId) =>{
    return {
        type: ActionTypes.REGISTER,
        name: name,
        email: email,
        password: password,
        userId: userId
    }
};

export const store_company = (company, companyId) =>{
    return {
        type: ActionTypes.STORE_COMPANY,
        company : company,
        companyId: companyId
    }
};

export const store_sepa =(confirmationLink) => {
    return {
        type: ActionTypes.STORE_SEPA,
        confirmationLink : confirmationLink
    }
};

export const logout = () => {
    return {
        type: ActionTypes.LOGOUT
    };
};