// app/admin/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateLeadStatus(formData: FormData) {
  const leadId = formData.get('leadId') as string
  const status = formData.get('status') as string

  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false, error: 'Failed to update lead status' }
  }
}

export async function updateUserStatus(formData: FormData) {
  const userId = formData.get('userId') as string
  const isActive = formData.get('isActive') === 'true'

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating user status:', error)
    return { success: false, error: 'Failed to update user status' }
  }
}

