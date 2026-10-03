import { prisma } from '../config/prisma.js';

const fields = {
  id: true,
  title: true,
  description: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
};

export async function list(req, res, next) {
  try {
    const where = {};

    if (req.query.status === 'active') {
      where.completed = false;
    }

    if (req.query.status === 'completed') {
      where.completed = true;
    }

    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      where.OR = [
        {
          title: {
            contains: req.query.q.trim(),
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: req.query.q.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const todos = await prisma.todo.findMany({
      where,
      select: fields,
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ data: todos });
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: req.params.id,
      },
      select: fields,
    });

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    res.json({
      data: todo,
    });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const title =
      typeof req.body.title === 'string'
        ? req.body.title.trim()
        : '';

    const description =
      typeof req.body.description === 'string'
        ? req.body.description.trim()
        : '';

    if (!title) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    if (title.length > 160 || description.length > 1000) {
      return res.status(400).json({
        error: 'Title max 160 and description max 1000 characters',
      });
    }

    const data = await prisma.todo.create({
      data: {
        title,
        description,
      },
      select: fields,
    });

    res.status(201).json({
      message: 'Todo created',
      data,
    });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = {};

    if (req.body.title !== undefined) {
      if (
        typeof req.body.title !== 'string' ||
        !req.body.title.trim()
      ) {
        return res.status(400).json({
          error: 'Title cannot be empty',
        });
      }

      data.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      if (typeof req.body.description !== 'string') {
        return res.status(400).json({
          error: 'Description must be text',
        });
      }

      data.description = req.body.description.trim();
    }

    if (!Object.keys(data).length) {
      return res.status(400).json({
        error: 'Provide title or description',
      });
    }

    if (
      (data.title?.length || 0) > 160 ||
      (data.description?.length || 0) > 1000
    ) {
      return res.status(400).json({
        error: 'Text is too long',
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: req.params.id,
      },
      data,
      select: fields,
    });

    res.json({
      message: 'Todo updated',
      data: updatedTodo,
    });
  } catch (e) {
    next(e);
  }
}

export async function toggle(req, res, next) {
  try {
    const old = await prisma.todo.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!old) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    const data = await prisma.todo.update({
      where: {
        id: req.params.id,
      },
      data: {
        completed: !old.completed,
      },
      select: fields,
    });

    res.json({
      message: 'Status updated',
      data,
    });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.todo.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: 'Todo deleted',
    });
  } catch (e) {
    next(e);
  }
}