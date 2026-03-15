import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { response } from "express";
import { map, Observable } from 'rxjs';

/**
 * TransformInterceptor
 * Intercepts responses and transforms them into a consistent format
 * Wraps the original response data in an object with a 'data' property
 * Example:-
 * Original response: { id: 1, name: 'John' }
 * Transformed response: { status: 'success', data: { id: 1, name: 'John' } }
 * This allows for a standardized API response structure across the application.
 */
export type ResponseFormat<T> = {
    success: boolean;
    message?: string;
    data: T;
};
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
        return next.handle().pipe(
            map(response => ({
                success: true,
                message: response.message || null,
                data: { ...response },
            })),
        );
    }
}