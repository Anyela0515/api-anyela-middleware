import { Request, Response, NextFunction } from 'express';
import { requireJwt } from './auth';

describe('Auth Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('Debe retornar status 401 si el header x-api-key esta ausente', () => {
        requireJwt(mockReq as Request, mockRes as Response, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ code: 401, error: 'API key inválida o ausente' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('Debe retornar status 401 si la clave es incorrecta', () => {
        mockReq.headers = { 'x-api-key': 'clave-equivocada' };
        
        requireJwt(mockReq as Request, mockRes as Response, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ code: 401, error: 'API key inválida o ausente' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('Debe invocar next() si la clave es valida sin emitir respuesta', () => {
        mockReq.headers = { 'x-api-key': 'secreto-demo' }; 
        
        requireJwt(mockReq as Request, mockRes as Response, mockNext);
        
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });
});