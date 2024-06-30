import { Body, Controller, Get, Post } from '@nestjs/common';
import { EngineObject, RayTracer } from './engine/ray-tracer';
import { MaterialType } from './engine/materials/material';
import { Vector3 } from './engine/vector3';
import { CameraOptions } from './engine/camera';
import { threeVectorToMyVector3 } from './engine/utils';

export interface RenderRequest {
  objects: EngineObject[];
  options: CameraOptions;
}

@Controller()
export class AppController {
  constructor() {}

  @Post('render')
  render(@Body() request: RenderRequest): string {
    const rayTracer = new RayTracer();

    const objectsInstantiated = request.objects.map((object) => ({
      position: threeVectorToMyVector3(object.position),
      color: new Vector3(object.color.x, object.color.y, object.color.z),
      material: object.material,
      scale: object.scale,
    }));

    return rayTracer.render(objectsInstantiated, request.options);
  }
}
