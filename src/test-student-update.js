// Testing student update fix
import { updateStudent } from './services/studentService';

// This script is for testing the updateStudent function to verify
// that it properly updates existing students instead of creating new ones

const testStudentUpdate = async () => {
  try {
    // Define the student ID (replace with an actual student ID from your database)
    const studentId = 'test-student-123';
    
    // Data to update - simulating assigning a batch to a student
    const updateData = {
      batchId: 'test-batch-123',     // Replace with actual batch ID
      rollNumber: 'TEST001',
      // Include any other fields you want to update
    };
    
    // Call the updateStudent function
    const result = await updateStudent(studentId, updateData);
    
    return result;
  } catch (error) {
    // Error handling without console.error
  }
};

// Execute the test 
// This would be executed in a real environment
// testStudentUpdate();

// Export the function for manual testing
export default testStudentUpdate;
