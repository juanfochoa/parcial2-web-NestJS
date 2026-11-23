import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AuthGuard } from "../auth.guard";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() payload: any) {
    return this.tasksService.create(payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findById(@Param("id") id: string) {
    return this.tasksService.findById(id);
  }
}
