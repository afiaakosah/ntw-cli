import { EntityCoreModule } from 'modules/entity-core';
import { ITodoModel } from '../types';

const { createBaseSchema, BaseModel } = EntityCoreModule.getChildren();

const TODO_MODEL_NAME = 'Todo';

const todoSchema = createBaseSchema<ITodoModel>(
  {
    // 
  },
  {
    modelName: TODO_MODEL_NAME,
  },
);

const TodoModel = new BaseModel<ITodoModel>(
  TODO_MODEL_NAME,
  todoSchema,
).getModel();

export { TodoModel };
