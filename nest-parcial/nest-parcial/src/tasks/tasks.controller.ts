import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() payload: any) {
    return this.tasksService.create(payload);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.tasksService.findById(id);
  }
}
