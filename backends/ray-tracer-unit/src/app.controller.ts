import { Body, Controller, Post } from '@nestjs/common';
import { CameraOptions } from './engine/camera';
import { EngineObject, RayTracer } from './engine/ray-tracer';
import { threeVectorToMyVector3 } from './engine/utils';
import { Vector3 } from './engine/vector3';

export interface RenderRequest {
  objects: EngineObject[];
  options: CameraOptions;
  frontendAssignedId: string;
}

@Controller()
export class AppController {
  @Post('render')
  async render(@Body() request: RenderRequest): Promise<string> {
    const response = await fetch(
      `${process.env.RENDER_GUARD_URL}/can-render/${request.frontendAssignedId}`,
    );
    const data = await response.json();

    const canRender = data.canRender;

    if (!canRender) {
      throw new Error('Daily limit used');
    }

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
