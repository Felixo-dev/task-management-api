import { prisma } from "../lib/prisma.js";
import { AppError } from "../types/app-error.js";


//create tasks
export const createTask = async (
  title: string,
  description: string,
  userId: number
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

//Get tasks
export const getTasks = async (
  skip: number,
  limit: number,
  completed: boolean | undefined,
  search: string | undefined,
  userId: number
) => {
 const where = {
    userId,
  ...(completed !== undefined && {
    completed,
  }),

  ...(search && {
    OR: [
      {
        title: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ],
  }),
};
  
const tasks = await prisma.task.findMany({
  skip,
  take: limit,
  orderBy: {
    createdAt: "asc",
  },
  where,
});

const total = await prisma.task.count({
  where,
});

  return {
    tasks,
    total,
  };
};


//Get a sigle task
export const getTaskById = async (
  id: number,
  userId: number
) => {
  const task = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!task) {
    throw new AppError("Task not found or access denied", 403);
  }

  return task;
};

/////update task
//export const updateTask = async (
//  id: number,
//  userId: number,
//  data: {
//    title?: string | undefined;
//    description?: string | undefined;
//    completed?: boolean | undefined;
//  }
//) => {
//  try {

//  const task = await prisma.task.findFirst({
//  where: {
//    id,
//    userId,
//  },
//});

//if (!task) {
//  throw new AppError("Task not found or access denied", 403);
//}

//    return await prisma.task.update({
//  where: {
//    id,
//  },
//  data: {
//    ...(data.title !== undefined && { title: data.title }), //The ... syntax conditionally adds a property only when it has a real value.
//    ...(data.description !== undefined && {
//      description: data.description,
//    }),
//    ...(data.completed !== undefined && {
//      completed: data.completed,
//    }),
//  },
//});
//  } catch (error) {
//    if (
//      error instanceof Prisma.PrismaClientKnownRequestError &&
//      error.code === "P2025"
//    ) {
//      throw new AppError("Task not found", 404);
//    }

//    throw error;
//  }
//};

///////////////////////////
export const updateTask = async (
id: number,
userId: number,
data: {
title?: string | undefined;
description?: string | undefined;
completed?: boolean | undefined;
}
) => {
const task = await prisma.task.findFirst({
where: {
id,
userId,
},
});

if (!task) {
throw new AppError("Task not found or access denied", 403);
}

return prisma.task.update({
where: {
id,
},
data: {
...(data.title !== undefined && {
title: data.title,
}),
...(data.description !== undefined && {
description: data.description,
}),
...(data.completed !== undefined && {
completed: data.completed,
}),
},
});
};



//////////////////////////

//delete task
//export const deleteTask = async (id: number, userId:number) => {
//const task = await prisma.task.findFirst({
//  where: {
//    id,
//    userId,
//  },
//});

//if (!task) {
//  throw new AppError("Task not found or access denied", 403);
//}

//  try {
//    return await prisma.task.delete({
//      where: {
//        id,
//      },
//    });
//  } catch (error) {
//    if (
//      error instanceof Prisma.PrismaClientKnownRequestError &&
//      error.code === "P2025"
//    ) {
//      throw new AppError("Task not found", 404);
//    }

//    throw error;
//  }
//};

export const deleteTask = async (
id: number,
userId: number
) => {
const task = await prisma.task.findFirst({
where: {
id,
userId,
},
});

if (!task) {
throw new AppError("Task not found or access denied", 403);
}

return prisma.task.delete({
where: {
id,
},
});
};
