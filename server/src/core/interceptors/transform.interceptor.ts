import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
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
export interface IApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
export interface IServiceResponse<T> {
    success?: boolean;
    message?: string;
    data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<IServiceResponse<T>, IApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((res: IServiceResponse<T>) => {
                return {
                    success: res.success ?? (statusCode >= 200 && statusCode < 300),
                    message: res.message ?? null,
                    data: res.data,
                };
            }),
        );
    }
}