import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

describe('Logger Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            method: 'GET',
            path: '/api/test'
        };
        mockRes = {
            statusCode: 200,
            on: jest.fn() 
        };
        mockNext = jest.fn();
        
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Debe invocar next() al recibir una peticion', () => {
        logger(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('Debe registrar el metodo y la ruta correctamente al finalizar la respuesta', () => {
        logger(mockReq as Request, mockRes as Response, mockNext);
        
      
        const onMock = mockRes.on as jest.Mock;
        
       
        const finishCallback = onMock.mock.calls[0][1];
        
      
        finishCallback();

    
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/\[GET\] \/api\/test - 200 - \d+ms/)
        );
    });
});