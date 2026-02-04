import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy 
} from 'firebase/firestore'
import { db } from '../firebase'

const COLLECTION_NAME = 'members'

/**
 * Fetch all family members from Firestore
 * @returns {Promise<Array>} Array of member objects
 */
export async function getAllMembers() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'))
    const querySnapshot = await getDocs(q)
    const members = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      members.push({
        ...data,
        docId: docSnap.id, // Firestore document ID for updates/deletes
        // Keep the custom id from data (like M52)
      })
    })
    
    return members
  } catch (error) {
    console.error('Error fetching members:', error)
    throw error
  }
}

/**
 * Generate next member ID (e.g., M65, M66, etc.)
 * @returns {Promise<string>} Next member ID
 */
export async function getNextMemberId() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    let maxNumber = 0
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const memberId = data.id || doc.id
      
      // Extract number from ID like "M17" -> 17
      if (memberId.startsWith('M')) {
        const number = parseInt(memberId.substring(1))
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number
        }
      }
    })
    
    // Return next ID
    return `M${maxNumber + 1}`
  } catch (error) {
    console.error('Error generating next member ID:', error)
    throw error
  }
}

/**
 * Add a new family member to Firestore
 * @param {Object} memberData - Member data object
 * @returns {Promise<string>} Custom member ID (e.g., M65)
 */
export async function addMember(memberData) {
  console.log('Adding member with data:', memberData)
  try {
    // Generate next member ID
    const memberId = (memberData.member_id) ? memberData.member_id : await getNextMemberId()
    
    // Add document with custom ID in the data
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      id: memberId,
      name: memberData.name || '',
      gender: memberData.gender || 'male',
      birth_year: memberData.birth_year || null,
      death_year: memberData.death_year || null,
      is_deceased: memberData.is_deceased || false,
      father_id: memberData.father_id || null,
      mother_id: memberData.mother_id || null,
      spouse_ids: memberData.spouse_ids || [],
      created_at: new Date().toISOString()
    })
    
    console.log('Member added with ID:', memberId)
    return memberId
  } catch (error) {
    console.error('Error adding member:', error)
    throw error
  }
}

/**
 * Update an existing family member
 * @param {string} memberId - Document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updateMember(memberId, updateData) {
  try {
    const memberRef = doc(db, COLLECTION_NAME, memberId)
    await updateDoc(memberRef, {
      ...updateData,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating member:', error)
    throw error
  }
}

/**
 * Delete a family member
 * @param {string} memberId - Document ID
 * @returns {Promise<void>}
 */
export async function deleteMember(memberId) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, memberId))
  } catch (error) {
    console.error('Error deleting member:', error)
    throw error
  }
}

/**
 * Build a hierarchical tree structure from flat member data
 * @param {Array} members - Array of member objects
 * @returns {Array} Array of root-level members with nested children
 */
export function buildFamilyTree(members) {
  if (!members || members.length === 0) return []
  
  // Create a map for quick lookup
  const memberMap = {}
  members.forEach(member => {
    memberMap[member.id] = { ...member, children: [] }
  })
  
  const roots = []
  const addedToTree = new Set()
  
  // Build parent-child relationships
  members.forEach(member => {
    const node = memberMap[member.id]
    
    // If member has a father, add to father's children
    if (member.father_id && memberMap[member.father_id]) {
      if (!addedToTree.has(member.id)) {
        memberMap[member.father_id].children.push(node)
        addedToTree.add(member.id)
      }
    }
    // If member has a mother but no father, add to mother's children
    else if (member.mother_id && memberMap[member.mother_id]) {
      if (!addedToTree.has(member.id)) {
        memberMap[member.mother_id].children.push(node)
        addedToTree.add(member.id)
      }
    }
  })
  
  // Find root members (those without parents)
  members.forEach(member => {
    if (!member.father_id && !member.mother_id && !addedToTree.has(member.id)) {
      roots.push(memberMap[member.id])
    }
  })
  
  // If we have multiple roots that are spouses, merge them
  if (roots.length > 1) {
    // Group roots by spouse relationships
    const spouseGroups = []
    const processed = new Set()
    
    roots.forEach(root => {
      if (processed.has(root.id)) return
      
      const group = [root]
      processed.add(root.id)
      
      // Find all spouses
      if (root.spouse_ids && root.spouse_ids.length > 0) {
        root.spouse_ids.forEach(spouseId => {
          const spouse = roots.find(r => r.id === spouseId)
          if (spouse && !processed.has(spouse.id)) {
            group.push(spouse)
            processed.add(spouse.id)
          }
        })
      }
      
      spouseGroups.push(group)
    })
    
    // Merge spouse groups into single nodes with combined children
    const mergedRoots = spouseGroups.map(group => {
      if (group.length === 1) return group[0]
      
      // Use first person as main root
      const mainRoot = group[0]
      
      // Combine children from all spouses
      group.forEach((spouse, index) => {
        if (index > 0 && spouse.children.length > 0) {
          spouse.children.forEach(child => {
            if (!mainRoot.children.find(c => c.id === child.id)) {
              mainRoot.children.push(child)
            }
          })
        }
      })
      
      return mainRoot
    })
    
    console.log('Built family tree roots:', mergedRoots)
    return mergedRoots
  }
  
  // Still no roots? Find members with no parents in database
  if (roots.length === 0) {
    members.forEach(member => {
      const hasParentInDb = (member.father_id && memberMap[member.father_id]) || 
                            (member.mother_id && memberMap[member.mother_id])
      
      if (!hasParentInDb && !addedToTree.has(member.id)) {
        roots.push(memberMap[member.id])
      }
    })
  }
  
  // Still no roots? Use oldest members
  if (roots.length === 0) {
    const membersWithBirthYear = members.filter(m => m.birth_year)
    if (membersWithBirthYear.length > 0) {
      const oldestYear = Math.min(...membersWithBirthYear.map(m => m.birth_year))
      membersWithBirthYear
        .filter(m => m.birth_year === oldestYear)
        .forEach(m => roots.push(memberMap[m.id]))
    }
  }
  
  // Last resort: use first member
  if (roots.length === 0 && members.length > 0) {
    roots.push(memberMap[members[0].id])
  }
  
  console.log('Built family tree roots:', roots)
  return roots
}

/**
 * Get generation level of a member (0 for roots, 1 for children, etc.)
 * @param {Object} member - Member object
 * @param {Array} allMembers - Array of all members
 * @returns {number} Generation level
 */
export function getGenerationLevel(member, allMembers) {
  if (!member.father_id && !member.mother_id) return 0
  
  const parent = allMembers.find(m => m.id === member.father_id || m.id === member.mother_id)
  if (!parent) return 0
  
  return 1 + getGenerationLevel(parent, allMembers)
}

/**
 * Import initial family data from JSON
 * @param {Array} familyData - Array of family member objects
 * @returns {Promise<number>} Number of members imported
 */
export async function importFamilyData(familyData) {
  try {
    let count = 0
    
    for (const member of familyData) {
        console.log('Importing member:', member)
        await addMember({
            name: member.name,
            gender: member.gender,
            birth_year: member.birth_year,
            death_year: member.death_year,
            is_deceased: member.is_deceased,
            father_id: member.father_id,
            mother_id: member.mother_id,
            spouse_ids: member.spouse_ids || [],
            member_id: member.id  // Preserve original ID if needed
        })
        count++
    }
    
    return count
  } catch (error) {
    console.error('Error importing family data:', error)
    throw error
  }
}
