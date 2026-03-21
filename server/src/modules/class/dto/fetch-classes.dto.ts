import { IsString } from "class-validator";

// export class FetchClassesRequestDto {
//     @IsString()
//     userId: string;
// }

export class FetchClassesResponseDto {
    message: string;
    classes: {
        classId: string;
        department: string;
        title: string;
        students: number;
        instructor: string;
        semester: string;
        themeColor: string;
        coverImage?: string;
        avatarUrl?: string | null;
        status: "active" | "archived";
    }[];
}