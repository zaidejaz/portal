// app/lead-generation/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

function generateLeadId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createLead(formData: FormData) {
  const leadId = generateLeadId();

  try {
    const lead = await prisma.lead.create({
      data: {
        leadId,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        emailAddress: formData.get('emailAddress') as string,
        propertyAddress: formData.get('propertyAddress') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
        isHomeOwner: formData.get('isHomeOwner') === 'true',
        propertyValue: parseFloat(formData.get('propertyValue') as string),
        hasRealtorContract: formData.get('hasRealtorContract') === 'true',
        status: 'pending'
      },
    })

    revalidatePath('/lead-generation')
    return { success: true, leadId: lead.leadId }
  } catch (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: 'Failed to create lead' }
  }
}

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