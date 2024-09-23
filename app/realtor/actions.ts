// app/realtor/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateLeadStatus(formData: FormData) {
  const assignmentId = formData.get('assignmentId') as string
  const status = formData.get('status') as string
  const comments = formData.get('comments') as string

  try {
    await prisma.leadAssignment.update({
      where: { id: assignmentId },
      data: { status, comments },
    })

    revalidatePath('/realtor')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false, error: 'Failed to update lead status' }
  }
}