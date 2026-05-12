import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";

import {
    Routine,
    RoutineSchema,
} from "../../database/entities/routine/routine.entity";

import {
    RoutineSlot,
    RoutineSlotSchema,
} from "../../database/entities/routine/routine-slot.entity";

import {
    AddSlotService,
    EditSlotService,
    GetRoutineService,
    CreateRoutineService,
    RemoveSlotService,
    DeleteRoutineService,
} from "./service";

import { RoutineController } from "./routine.controller";

import {
    User,
    UserSchema,
} from "../../database/entities/user.entity";

import {
    Class,
    ClassSchema,
} from "../../database/entities/class.entity";

import {
    Enrollment,
    EnrollmentSchema,
} from "../../database/entities/enrollment.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Routine.name,
                schema: RoutineSchema,
            },

            {
                name: RoutineSlot.name,
                schema: RoutineSlotSchema,
            },

            {
                name: User.name,
                schema: UserSchema,
            },

            {
                name: Class.name,
                schema: ClassSchema,
            },

            {
                name: Enrollment.name,
                schema: EnrollmentSchema,
            },
        ]),
    ],

    controllers: [RoutineController],

    providers: [
        CreateRoutineService,
        GetRoutineService,
        AddSlotService,
        EditSlotService,
        RemoveSlotService,
        DeleteRoutineService,
    ],

    exports: [
        AddSlotService,
        EditSlotService,
    ],
})
export class RoutineModule {}