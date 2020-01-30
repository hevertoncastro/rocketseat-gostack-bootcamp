const express = require('express')
const server = express()

server.use(express.json())

/**
 * Variable used as a store for projects
 */
const projects = []

/**
 * Middleware that checks if project exists
 */
function checkProjectExists(req, res, next) {
  const project = projects.find((project) => project.id === req.params.id)

  if (!project) {
    return res.status(400).json({
      error: 'Project not found'
    })
  }

  req.project = project

  return next()
}

/**
 * Middleware that if title is filled
 */
function isTitleFilled(req, res, next) {
  const {
    title
  } = req.body

  if (!title) {
    return res.status(400).json({
      error: 'Title is required'
    })
  }

  req.title = title

  return next()
}

/**
 * Global middleware that count requests
 */
function logRequests(req, res, next) {
  console.count('Amount of requests');
  return next()
}

server.use(logRequests)

/**
 * Endpoint that returns all projects
 */
server.get('/projects', (req, res) => {
  return res.json(projects)
})

/**
 * Endpoint that creates a new project
 */
server.post('/projects', isTitleFilled, (req, res) => {
  const {
    id
  } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'Id is required'
    })
  }

  projects.push({
    id,
    title: req.title,
    tasks: [],
  })

  return res.json(projects)
})

/**
 * Endpoint that edits a project's title
 */
server.put('/projects/:id', checkProjectExists, isTitleFilled, (req, res) => {
  req.project.title = req.title

  return res.json(projects)
})

/**
 * Endpoint that deletes a project
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  projects.splice(req.project, 1)

  return res.send()
})

/**
 * Endpoint that creates a new task for a project
 */
server.post('/projects/:id/tasks', checkProjectExists, isTitleFilled, (req, res) => {
  req.project.tasks.push(req.title)

  return res.json(req.project)
})

server.listen(3000)