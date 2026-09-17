const API_URL = 'http://localhost:3001/tasks'

export async function getTasks() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return response.json()
}

export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error('Failed to create task')
  }
  return response.json()
}


export async function updateTask(taskId, updates) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error('Failed to update task')
  }
  return response.json()
}


export async function deleteTaskRequest(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete task')
  }
}