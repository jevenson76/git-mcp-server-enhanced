import { z } from 'zod';

export function zodToJsonSchema(schema: z.ZodSchema<any>): any {
  // For MCP tools, we need to provide a simple JSON Schema
  // The MCP SDK expects standard JSON Schema format
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: any = {};
    const required: string[] = [];
    
    for (const [key, value] of Object.entries(shape)) {
      const zodType = value as z.ZodSchema<any>;
      properties[key] = zodTypeToJsonSchema(zodType);
      
      // Check if field is required
      if (!zodType.isOptional()) {
        required.push(key);
      }
    }
    
    return {
      type: 'object',
      properties,
      required
    };
  }
  
  return zodTypeToJsonSchema(schema);
}

function zodTypeToJsonSchema(zodType: z.ZodSchema<any>): any {
  if (zodType instanceof z.ZodString) {
    return { type: 'string' };
  } else if (zodType instanceof z.ZodNumber) {
    return { type: 'number' };
  } else if (zodType instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  } else if (zodType instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodTypeToJsonSchema(zodType.element)
    };
  } else if (zodType instanceof z.ZodOptional) {
    return zodTypeToJsonSchema(zodType.unwrap());
  } else if (zodType instanceof z.ZodObject) {
    return zodToJsonSchema(zodType);
  } else {
    // Default to string for unknown types
    return { type: 'string' };
  }
}
