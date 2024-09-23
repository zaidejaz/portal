// app/qa/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submissionDate: 'desc' },
    })
    return leads
  } catch (error) {
    console.error('Error fetching leads:', error)
    throw new Error('Failed to fetch leads')
  }
}

export async function updateLeadStatus({ leadId, status }: { leadId: string; status: string }) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })
    revalidatePath('/qa')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false, error: 'Failed to update lead status' }
  }
}

export async function updateLeadRecording({ leadId, recording }: { leadId: string; recording: string }) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { recording: recording || null }, // Use null if recording is an empty string
    })
    revalidatePath('/qa')
    return { success: true }
  } catch (error) {
    console.error('Error updating lead recording:', error)
    return { success: false, error: 'Failed to update lead recording' }
  }
}