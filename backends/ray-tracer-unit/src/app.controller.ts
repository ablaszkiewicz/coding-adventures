import { Body, Controller, Get, Post } from '@nestjs/common';
import { EngineObject, RayTracer } from './engine/ray-tracer';
import { Vector3 } from './engine/vector3';
import { CameraOptions } from './engine/camera';
import { threeVectorToMyVector3 } from './engine/utils';
import { RenderEntryService } from './render-entry.service';

export interface RenderRequest {
  objects: EngineObject[];
  options: CameraOptions;
  frontendAssignedId: string;
}

@Controller()
export class AppController {
  constructor(private readonly renderEntryService: RenderEntryService) {
    console.log(process.env.MONGO_URL);
  }

  @Post('render')
  async render(@Body() request: RenderRequest): Promise<string> {
    // await this.renderEntryService.record(request.frontendAssignedId);

    const rayTracer = new RayTracer();

    const objectsInstantiated = request.objects.map((object) => ({
      position: threeVectorToMyVector3(object.position),
      color: new Vector3(object.color.x, object.color.y, object.color.z),
      material: object.material,
      scale: object.scale,
    }));

    return rayTracer.render(objectsInstantiated, request.options);
  }

  @Get('credits')
  async getCreditsCount(): Promise<number> {
    return this.renderEntryService.getDailyCount();
  }
}
