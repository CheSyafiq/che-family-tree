<script setup>
import { ref } from 'vue'

const familyMembers = ref([
  { id: 1, name: 'John Doe', relation: 'Father' },
  { id: 2, name: 'Jane Doe', relation: 'Mother' },
])

const newMember = ref({ name: '', relation: '' })

const addMember = () => {
  if (newMember.value.name && newMember.value.relation) {
    familyMembers.value.push({
      id: Date.now(),
      name: newMember.value.name,
      relation: newMember.value.relation,
    })
    newMember.value = { name: '', relation: '' }
  }
}

const removeMember = (id) => {
  familyMembers.value = familyMembers.value.filter(member => member.id !== id)
}
</script>

<template>
  <div class="family-tree">
    <h2>Family Members</h2>
    
    <div class="add-member">
      <input 
        v-model="newMember.name" 
        type="text" 
        placeholder="Name"
        @keyup.enter="addMember"
      />
      <input 
        v-model="newMember.relation" 
        type="text" 
        placeholder="Relation"
        @keyup.enter="addMember"
      />
      <button @click="addMember">Add Member</button>
    </div>

    <div class="members-list">
      <div 
        v-for="member in familyMembers" 
        :key="member.id" 
        class="member-card"
      >
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p>{{ member.relation }}</p>
        </div>
        <button @click="removeMember(member.id)" class="remove-btn">Remove</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.family-tree {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #42b883;
  margin-bottom: 1.5rem;
}

.add-member {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-member input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.add-member button {
  padding: 0.5rem 1.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.add-member button:hover {
  background-color: #35a372;
}

.members-list {
  display: grid;
  gap: 1rem;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: box-shadow 0.2s;
}

.member-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.member-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.member-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c0392b;
}
</style>
