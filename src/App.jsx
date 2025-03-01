import { useState, useEffect } from 'react'
import './App.css'
import { db, storage } from './firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

// Update the style constants with more professional and consistent styling
const cardStyle = `
  bg-white rounded-xl border border-gray-200/80 shadow-sm
  transition-all duration-300 hover:shadow-lg hover:border-blue-200/50
  backdrop-filter backdrop-blur-sm
`

const buttonStyle = `
  px-4 py-2.5 rounded-lg font-medium shadow-sm
  transition-all duration-300 transform active:scale-95
  focus:outline-none focus:ring-2 focus:ring-offset-2
`

const primaryButtonStyle = `
  ${buttonStyle}
  bg-gradient-to-r from-blue-600 to-blue-700 
  hover:from-blue-700 hover:to-blue-800
  text-white focus:ring-blue-500
`

const secondaryButtonStyle = `
  ${buttonStyle}
  bg-gray-50 hover:bg-gray-100 
  text-gray-700 hover:text-gray-900
  border border-gray-200 hover:border-gray-300
  focus:ring-gray-500
`

const dangerButtonStyle = `
  ${buttonStyle}
  bg-red-50 hover:bg-red-100
  text-red-600 hover:text-red-700
  border border-red-200 hover:border-red-300
  focus:ring-red-500
`

const successButtonStyle = `
  ${buttonStyle}
  bg-green-50 hover:bg-green-100
  text-green-600 hover:text-green-700
  border border-green-200 hover:border-green-300
  focus:ring-green-500
`

const inputStyle = `
  w-full px-4 py-2.5 rounded-lg border border-gray-300
  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-200 bg-white
  placeholder-gray-400 text-gray-900
`

const selectStyle = `
  ${inputStyle}
  appearance-none bg-no-repeat
  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3E%3C/svg%3E')]
  bg-[length:1.25em_1.25em] bg-[right_0.5rem_center]
  pr-10
`

const labelStyle = `
  block text-sm font-medium text-gray-700 mb-1
`

const cardHeaderStyle = `
  p-6 border-b border-gray-100
  bg-gradient-to-r from-gray-50 to-white
`

// Add these new professional styles
const tableStyle = `
  min-w-full divide-y divide-gray-200 
  bg-white shadow-sm rounded-lg border border-gray-200
`

const tableHeaderStyle = `
  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
  bg-gray-50 border-b border-gray-200
`

const tableRowStyle = `
  hover:bg-gray-50 transition-colors duration-200
`

const tableCellStyle = `
  px-6 py-4 whitespace-nowrap text-sm text-gray-900
`

const badgeStyle = (color) => `
  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
  ${color === 'green' ? 'bg-green-100 text-green-800' :
    color === 'red' ? 'bg-red-100 text-red-800' :
    color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
    color === 'blue' ? 'bg-blue-100 text-blue-800' :
    'bg-gray-100 text-gray-800'}
`

const modalStyle = `
  fixed inset-0 bg-black/40 backdrop-blur-sm
  flex items-center justify-center z-50
  transition-opacity duration-300
`

const modalContentStyle = `
  bg-white rounded-xl shadow-xl
  max-w-2xl w-full mx-4 max-h-[90vh]
  overflow-y-auto border border-gray-200
  transform transition-all duration-300
  scale-95 opacity-0 animate-in
`

// Add new animation classes
const fadeInAnimation = `
  animate-[fadeIn_0.2s_ease-in-out]
`

const slideUpAnimation = `
  animate-[slideUp_0.3s_ease-out]
`

// Add back the sidebarButtonStyle with improvements
const sidebarButtonStyle = `
  w-full text-left px-4 py-3 rounded-lg 
  transition-all duration-300 
  hover:bg-blue-50/80 
  focus:outline-none focus:ring-2 focus:ring-blue-200
  flex items-center justify-between
  text-gray-600 hover:text-gray-900
`

// Update the sidebar styling to include both old and new styles
const sidebarStyle = `
  w-64 bg-white shadow-lg
  flex flex-col
  border-r border-gray-200
`

const sidebarItemStyle = `
  flex items-center gap-3 px-4 py-3 rounded-lg
  transition-all duration-200
  text-gray-600 hover:text-gray-900
  hover:bg-gray-50
`

const sidebarItemActiveStyle = `
  ${sidebarItemStyle}
  bg-blue-50 text-blue-600
  font-medium
`

// Keep only this declaration with the other attendance-related styles
const attendanceCardStyle = `
  ${cardStyle}
  overflow-hidden
`

const attendanceHeaderStyle = `
  ${cardHeaderStyle}
  bg-gradient-to-r from-blue-50 to-gray-50
`

const attendanceTableStyle = `
  ${tableStyle}
  bg-white backdrop-filter backdrop-blur-sm
`

const attendanceButtonStyle = (isActive, type) => `
  ${buttonStyle}
  flex items-center gap-2 text-sm
  ${isActive
    ? type === 'present'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-red-100 text-red-800 border border-red-200'
    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-blue-50'}
`

const attendanceStatusBadge = (status) => `
  ${badgeStyle(
    status === 'present' ? 'green' :
    status === 'absent' ? 'red' : 'gray'
  )}
`

const mockTestCardStyle = `
  ${cardStyle}
  hover:border-blue-200
`

const mockTestHeaderStyle = `
  ${cardHeaderStyle}
  bg-gradient-to-r from-blue-50 to-gray-50
`

const mockScoreStyle = (score, maxScore) => `
  ${badgeStyle(
    score >= maxScore * 0.8 ? 'green' :
    score >= maxScore * 0.6 ? 'yellow' : 'red'
  )}
`

// Add back the search input style
const searchInputStyle = `
  ${inputStyle}
  w-72
  bg-white/90 backdrop-blur-sm backdrop-filter
`

// Add these new components for better UX
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
)

const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-12">
    <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 max-w-sm mx-auto">{description}</p>
  </div>
)

// Update the Alert component for better visibility
const Alert = ({ type, message, onClose }) => (
  <div className={`
    fixed top-4 right-4 z-50 
    ${fadeInAnimation}
    max-w-md w-full
  `}>
    <div className={`
      rounded-lg shadow-lg p-4
      ${type === 'success' ? 'bg-green-50 border border-green-200' :
        type === 'error' ? 'bg-red-50 border border-red-200' :
        'bg-blue-50 border border-blue-200'}
    `}>
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <p className={`font-medium ${
          type === 'success' ? 'text-green-800' :
          type === 'error' ? 'text-red-800' :
          'text-blue-800'
        }`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)

// Add a new component for form sections
const FormSection = ({ title, description, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
    {children}
  </div>
)

// Add this new component for the attendance details modal
const AttendanceDetailsModal = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly', 'monthly', 'overall'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Get attendance records based on active tab
  const getFilteredRecords = () => {
    const records = student.attendance?.class || [];
    const today = new Date();

    switch (activeTab) {
      case 'weekly':
        const lastWeek = new Date(today.setDate(today.getDate() - 7));
        return records.filter(record => new Date(record.date) >= lastWeek);
      case 'monthly':
        return records.filter(record => record.date.startsWith(selectedMonth));
      default:
        return records;
    }
  };

  // Calculate attendance statistics
  const calculateStats = (records) => {
    const total = records.length;
    const present = records.filter(r => r.present).length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    return { total, present, absent: total - present, percentage };
  };

  const filteredRecords = getFilteredRecords();
  const stats = calculateStats(filteredRecords);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white">
                {student.imageUrl ? (
                  <img src={student.imageUrl} alt={student.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                <p className="text-sm text-gray-600">Batch: {student.batch}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {['weekly', 'monthly', 'overall'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm font-medium text-blue-600">Total Days</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-sm font-medium text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-sm font-medium text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-sm font-medium text-purple-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-purple-700">{stats.percentage.toFixed(1)}%</p>
            </div>
          </div>

          {/* Month Selector for Monthly View */}
          {activeTab === 'monthly' && (
            <div className="mb-6">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          )}

          {/* Attendance Calendar */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.date}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.present
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this with other style constants at the top of the file
const cardHoverStyle = `
  hover:shadow-lg hover:border-blue-200/50
  transition-all duration-300 transform
  hover:-translate-y-0.5
`

function App() {
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Helper function to get last 7 dates
  const getLast7Days = () => {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // Change from const to state
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: 'Morning Batch',
      startTime: '09:00', // Changed to 24-hour format
      endTime: '11:00',
      daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
      trainer: 'John Doe'
    },
    {
      id: 2,
      name: 'Afternoon Batch',
      startTime: '14:00',
      endTime: '16:00',
      daysOfWeek: ['Tuesday', 'Thursday', 'Saturday'],
      trainer: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Evening Batch',
      startTime: '18:00',
      endTime: '20:00',
      daysOfWeek: ['Monday', 'Tuesday', 'Thursday'],
      trainer: 'Mike Johnson'
    },
    {
      id: 4,
      name: 'Weekend Batch',
      startTime: '10:00',
      endTime: '13:00',
      daysOfWeek: ['Saturday', 'Sunday'],
      trainer: 'Sarah Brown'
    }
  ])

  // Update student structure to include batch
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      rollNumber: '001',
      batchId: 1,
      attendance: {
        scrum: [],
        class: [],
      }
    },
    { id: 2, name: 'Jane Smith', attendance: false },
    { id: 3, name: 'Mike Johnson', attendance: true },
  ])

  // First, make sure the newStudent state includes gender
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    batch: '',
    gender: '',
    contactNumber: '',
    email: '',
    image: null,
    imageUrl: '',
    attendance: {
      scrum: [],
      class: []
    }
  })

  const [showForm, setShowForm] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState(null)

  // Add new state for selected students
  const [selectedStudents, setSelectedStudents] = useState([])
  const [bulkAction, setBulkAction] = useState(false)
  const [bulkScore, setBulkScore] = useState('')

  // Add state for mock test selection
  const [selectedMock, setSelectedMock] = useState('')
  const [bulkMockScore, setBulkMockScore] = useState('')

  // Add new view option in state
  const [currentView, setCurrentView] = useState('students') // 'students', 'attendance', or 'mock'

  // Add these new state variables at the top of the App component
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [dateRange, setDateRange] = useState({
    start: getTodayDate(),
    end: getTodayDate()
  })

  // Add search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')

  // Add new state for single date filter
  const [filterType, setFilterType] = useState('range'); // 'range' or 'single'
  const [singleDate, setSingleDate] = useState(getTodayDate());

  // Add these new states for date filtering
  const [attendanceFilterType, setAttendanceFilterType] = useState('single') // 'single' or 'range'
  const [attendanceDateRange, setAttendanceDateRange] = useState({
    start: getTodayDate(),
    end: getTodayDate()
  })

  // Add this new helper function
  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  // Add this function to get attendance status for a specific date and type
  const getAttendanceForDate = (student, date, type) => {
    return student.attendance[type]?.find(record => record.date === date)?.present || false
  }

  // Add function to check if today is a mock test day
  const isMockTestDay = (testId) => {
    const test = mockTests.find(t => t.id === testId)
    return test?.date === getTodayDate()
  }

  // Update the mock test table to show scheduled dates
  const getMockTestStatus = (test) => {
    const today = getTodayDate()
    if (test.date < today) return 'Completed'
    if (test.date === today) return 'Today'
    return `Scheduled for ${formatDate(test.date)}`
  }

  // Modify the mock score input to only allow entry on test day
  const canEnterMockScore = (testId) => {
    const test = mockTests.find(t => t.id === testId)
    return test?.date === getTodayDate()
  }

  // Add attendance type selection
  const [attendanceType, setAttendanceType] = useState('class') // 'scrum' or 'class'

  // Update attendance tracking
  const toggleAttendance = async (studentId) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      const student = students.find(s => s.id === studentId);
      const newAttendance = !getAttendanceForDate(student, selectedDate, attendanceType);

      // Update attendance in Firestore
      await updateDoc(studentRef, {
        attendance: {
          ...student.attendance,
          [attendanceType]: [
            ...(student.attendance[attendanceType] || []).filter(
              record => record.date !== selectedDate
            ),
            { date: selectedDate, present: newAttendance }
          ].sort((a, b) => new Date(b.date) - new Date(a.date))
        }
      });

      // Remove scrum attendance data if it exists
      if (attendanceType === 'scrum') {
        delete student.attendance.scrum; // Remove scrum attendance
        await updateDoc(studentRef, {
          attendance: {
            ...student.attendance
          }
        });
      }

      // Store attendance data in a separate collection if needed
      await addDoc(collection(db, 'attendance'), {
        studentId: studentId,
        date: selectedDate,
        type: attendanceType,
        present: newAttendance
      });

      await fetchStudents();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  // Update mock score function
  const updateMockScore = async (studentId, newScore) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      const student = students.find(s => s.id === studentId);
      const parsedScore = parseInt(newScore);

      await updateDoc(studentRef, {
        mockScores: student.mockScores.map(score =>
          score.mockId === selectedMock ? { ...score, score: parsedScore } : score
        )
      });

      await fetchStudents();
    } catch (error) {
      console.error('Error updating mock score:', error);
    }
  };

  // Add these new functions for Firebase operations
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'batches'));
      const batchesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBatches(batchesData);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  // Add these new states
  const [batchStartDate, setBatchStartDate] = useState(getTodayDate());

  // Add this helper function to generate attendance records from batch start date
  const generateAttendanceRecords = (startDate, batchDays) => {
    const records = [];
    const start = new Date(startDate);
    const today = new Date();
    
    // Loop through each date from start date to today
    for (let date = new Date(start); date <= today; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Only add record if it's a batch day
      if (batchDays.includes(dayOfWeek)) {
        records.push({
          date: date.toISOString().split('T')[0],
          present: false // Mark as absent by default
        });
      }
    }

    return records;
  };

  // Update handleSubmit for students
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setAlertMessage('Processing your request...');
      setAlertType('success');
      setShowAlert(true);

      let imageUrl = newStudent.imageUrl;

      if (newStudent.image) {
        const storageRef = ref(storage, `student-images/${Date.now()}-${newStudent.image.name}`);
        await uploadBytes(storageRef, newStudent.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Get batch details
      const selectedBatchData = batches.find(b => b.name === newStudent.batch);

      // Generate attendance records from batch start date
      let attendanceRecords = [];
      if (selectedBatchData) {
        attendanceRecords = generateAttendanceRecords(
          selectedBatchData.startDate,
          selectedBatchData.daysOfWeek
        );
      }

      const studentData = {
        ...newStudent,
        imageUrl,
        gender: newStudent.gender,
        createdAt: new Date().toISOString(),
        attendance: {
          class: attendanceRecords,
          scrum: []
        }
      };

      if (selectedStudent) {
        // Update existing student
        const studentRef = doc(db, 'students', selectedStudent.id);

        // Merge existing attendance with new records
        const existingRecords = selectedStudent.attendance?.class || [];
        const mergedRecords = [...existingRecords];

        attendanceRecords.forEach(newRecord => {
          const existingIndex = mergedRecords.findIndex(r => r.date === newRecord.date);
          if (existingIndex === -1) {
            mergedRecords.push(newRecord);
          }
        });

        studentData.attendance.class = mergedRecords;

        await updateDoc(studentRef, studentData);
        setAlertMessage(`${newStudent.name}'s information has been successfully updated!`);
      } else {
        // Add new student
        await addDoc(collection(db, 'students'), studentData);
        setAlertMessage(`${newStudent.name} has been successfully added!`);
      }

      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      await fetchStudents();

      // Reset form
      setNewStudent({
        name: '',
        rollNumber: '',
        batch: '',
        gender: '',
        image: null,
        imageUrl: '',
        attendance: { scrum: [], class: [] }
      });
      setSelectedStudent(null);
      setShowForm(false);

    } catch (error) {
      console.error('Error saving student:', error);
      setAlertMessage(`Failed to ${selectedStudent ? 'update' : 'add'} student: ${error.message}`);
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Update handleBatchSubmit
  const handleBatchSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBatch) {
        // Update existing batch
        const batchRef = doc(db, 'batches', editingBatch.id);
        await updateDoc(batchRef, {
          name: newBatch.name,
          startTime: newBatch.startTime,
          endTime: newBatch.endTime,
          daysOfWeek: newBatch.daysOfWeek,
          trainer: newBatch.trainer,
          startDate: batchStartDate // Add start date
        });

        // Update attendance records for all students in this batch
        const studentsToUpdate = students.filter(
          student => student.batch?.toString() === editingBatch.name?.toString()
        );

        for (const student of studentsToUpdate) {
          const studentRef = doc(db, 'students', student.id);
          const newRecords = generateAttendanceRecords(batchStartDate, newBatch.daysOfWeek);

          // Merge existing attendance with new records
          const existingRecords = student.attendance?.class || [];
          const mergedRecords = [...existingRecords];

          newRecords.forEach(newRecord => {
            const existingIndex = mergedRecords.findIndex(r => r.date === newRecord.date);
            if (existingIndex === -1) {
              mergedRecords.push(newRecord);
            }
          });

          await updateDoc(studentRef, {
            batch: newBatch.name,
            attendance: {
              ...student.attendance,
              class: mergedRecords
            }
          });
        }

        setAlertMessage('Batch updated successfully!');
      } else {
        // Create new batch
        const batchData = {
          ...newBatch,
          startDate: batchStartDate,
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'batches'), batchData);
        setAlertMessage('New batch created successfully!');
      }

      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      // Reset form and state
      setNewBatch({
        name: '',
        startTime: '',
        endTime: '',
        daysOfWeek: [],
        trainer: ''
      });
      setBatchStartDate(getTodayDate());
      setEditingBatch(null);
      setShowBatchForm(false);
      setCurrentView('batches-view');

      // Refresh data
      fetchBatches();
      fetchStudents();

    } catch (error) {
      console.error('Error saving batch:', error);
      setAlertMessage('Failed to save batch. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Update handleDeleteStudent
  const handleDeleteStudent = async (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        // Delete student document
        await deleteDoc(doc(db, 'students', studentId));

        // Delete student image if exists
        const student = students.find(s => s.id === studentId);
        if (student?.imageUrl) {
          const imageRef = ref(storage, student.imageUrl);
          await deleteObject(imageRef);
        }

        // Refresh students list
        await fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Add useEffect to fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  const viewStudentReport = (student) => {
    setSelectedStudent(student)
  }

  const closeReport = () => {
    setSelectedStudent(null)
  }

  // Update the average score calculation to handle absent students and affect the average
  const calculateAverageScore = (scores) => {
    if (!scores || scores.length === 0) return 0
    const totalTests = scores.length
    const totalScore = scores.reduce((acc, test) => {
      // If student was absent, count it as 0
      return acc + (test.absent ? 0 : test.score)
    }, 0)
    return (totalScore / totalTests).toFixed(1)
  }

  // Update the attendance calculation to include absent days
  const calculateAttendancePercentage = (attendance, type) => {
    if (!attendance || !attendance[type] || attendance[type].length === 0) return 0
    const totalDays = attendance[type].length
    const presentDays = attendance[type].filter(day => day.present).length
    return ((presentDays / totalDays) * 100).toFixed(1)
  }

  // Keep only this version
  const calculateAttendanceForRange = (history, startDate, endDate) => {
    if (!history || history.length === 0) return 0
    const filteredHistory = history.filter(record => {
      const recordDate = new Date(record.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return recordDate >= start && recordDate <= end
    })
    const present = filteredHistory.filter(day => day.present).length
    return filteredHistory.length > 0
      ? ((present / filteredHistory.length) * 100).toFixed(1)
      : '0.0'
  }

  // Add a function to get class performance including absents
  const getClassPerformance = (testId) => {
    const test = mockTests.find(t => t.id === testId)
    if (!test) return 0

    const studentsWithScores = students.filter(s =>
      s.mockScores.some(score => score.mockId === testId)
    )

    if (studentsWithScores.length === 0) return 0

    const totalScore = studentsWithScores.reduce((acc, student) => {
      const score = student.mockScores.find(s => s.mockId === testId)
      return acc + (score.absent ? 0 : score.score)
    }, 0)

    return (totalScore / studentsWithScores.length).toFixed(1)
  }

  // Add a function to get student's performance summary
  const getStudentPerformanceSummary = (student) => {
    const totalTests = student.mockScores.length
    const absentCount = student.mockScores.filter(score => score.absent).length
    const averageScore = calculateAverageScore(student.mockScores)

    return {
      totalTests,
      absentCount,
      averageScore,
      attendanceRate: ((totalTests - absentCount) / totalTests * 100).toFixed(1)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Add select all function
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(student => student.id))
    } else {
      setSelectedStudents([])
    }
  }

  // Add toggle single selection function
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  // Update the bulk attendance marking function to handle both types
  const markBulkAttendance = (present) => {
    const today = getTodayDate()

    setStudents(students.map(student => {
      if (selectedStudents.includes(student.id)) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [attendanceType]: [
              ...(student.attendance[attendanceType] || []).filter(
                record => record.date !== today
              ),
              { date: today, present }
            ]
          }
        }
      }
      return student
    }))
    setSelectedStudents([]) // Clear selection after marking
  }

  // Add bulk score update function
  const updateBulkScore = () => {
    if (!bulkScore) return

    const today = getTodayDate()
    const score = parseInt(bulkScore)

    setStudents(students.map(student => {
      if (selectedStudents.includes(student.id)) {
        return {
          ...student,
          mockScores: student.mockScores.map(s =>
            s.mockId === selectedMock ? { ...s, score } : s
          ),
          attendanceHistory: [
            ...(student.attendanceHistory || []).filter(
              record => record.date !== today
            ),
            { date: today, present: score > 0 }
          ].sort((a, b) => new Date(b.date) - new Date(a.date))
        }
      }
      return student
    }))
    setBulkScore('')
  }

  // Update bulk score function for specific mock tests
  const updateBulkMockScore = () => {
    const test = mockTests.find(t => t.id === selectedMock)
    if (!test) return

    setStudents(students.map(student => {
      if (selectedStudents.includes(student.id)) {
        const updatedMockScores = [
          ...(student.mockScores || []).filter(s => s.mockId !== selectedMock),
          {
            mockId: selectedMock,
            score: parseInt(bulkMockScore),
            date: test.date,
            absent: false
          }
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
        return { ...student, mockScores: updatedMockScores }
      }
      return student
    }))
    setBulkMockScore('')
    setSelectedStudents([])
  }

  // Function to get mock test score for a student
  const getStudentMockScore = (student, testId) => {
    const score = student.mockScores?.find(s => s.mockId === testId)
    if (!score) return ''
    return score.absent ? 'Absent' : score.score
  }

  // Add these new state variables
  const [selectedTest, setSelectedTest] = useState(null)

  // Add this function to check if a test can be scored
  const canScoreTest = (test) => {
    const testDate = new Date(test.date)
    const today = new Date(getTodayDate())
    return testDate <= today
  }

  // Add edit student state
  const [editingStudent, setEditingStudent] = useState(null)

  // Add function to handle student edit
  const handleEditStudent = (student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  // Add function to get unique classes
  const getUniqueClasses = () => {
    const classes = new Set(students.map(student => student.class))
    return ['all', ...Array.from(classes)]
  }

  // Add function to filter students
  const getFilteredStudents = () => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        student.name?.toLowerCase().includes(searchLower) ||
        student.rollNumber?.toLowerCase().includes(searchLower) ||
        student.batch?.toString().includes(searchLower);
      const matchesClass = filterClass === 'all' || student.class === filterClass
      return matchesSearch && matchesClass
    })
  }

  // Add this function to get attendance records for the date range
  const getAttendanceRecords = (student) => {
    return student.attendanceHistory?.filter(record =>
      record.date >= dateRange.start &&
      record.date <= dateRange.end
    ).sort((a, b) => new Date(b.date) - new Date(a.date)) || []
  }

  // Add this function to get formatted attendance history
  const getFormattedAttendanceHistory = (student) => {
    return (student.attendanceHistory || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(record => ({
        ...record,
        formattedDate: formatDate(record.date)
      }))
  }

  // Add this function to get formatted mock test history
  const getFormattedMockHistory = (student) => {
    return (student.mockScores || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(score => ({
        ...score,
        testName: mockTests.find(test => test.id === score.mockId)?.name || 'Unknown Test',
        maxScore: mockTests.find(test => test.id === score.mockId)?.maxScore || 100,
        formattedDate: formatDate(score.date)
      }))
  }

  // Add batch selection state
  const [selectedBatch, setSelectedBatch] = useState('')

  // Add batch filtering function
  const getStudentsByBatch = () => {
    return students.filter(student => student.batchId === selectedBatch)
  }

  const [editingMock, setEditingMock] = useState(null)
  const [newMock, setNewMock] = useState({
    name: '',
    maxScore: '',
    date: getTodayDate()
  })

  // Add state for feedback messages
  const [feedback, setFeedback] = useState({ message: '', type: '' }) // type can be 'success' or 'error'

  // Handle mock test form submission
  const handleSubmitMockTest = (e) => {
    e.preventDefault()

    const newMockTest = {
      id: editingMock ? editingMock.id : Date.now(),
      name: newMock.name,
      maxScore: parseInt(newMock.maxScore),
      date: newMock.date,
      allowAbsent: true
    }

    if (editingMock) {
      // Update existing mock test
      setMockTests(mockTests.map(test =>
        test.id === editingMock.id ? newMockTest : test
      ))
    } else {
      // Add new mock test
      setMockTests([...mockTests, newMockTest])
    }

    // Reset form
    setNewMock({ name: '', maxScore: '', date: getTodayDate() })
    setEditingMock(null)
    setShowMockForm(false)
  }

  // Add validation to the form
  const validateMockTest = () => {
    if (!newMock.name.trim()) {
      alert('Please enter a test name')
      return false
    }
    if (!newMock.maxScore || parseInt(newMock.maxScore) <= 0) {
      alert('Please enter a valid maximum score')
      return false
    }
    if (!newMock.date) {
      alert('Please select a test date')
      return false
    }
    return true
  }

  // Update the form submission to include validation
  const handleMockSubmit = (e) => {
    e.preventDefault()
    if (!validateMockTest()) return

    const newMockTest = {
      id: editingMock ? editingMock.id : Date.now(),
      name: newMock.name.trim(),
      maxScore: parseInt(newMock.maxScore),
      date: newMock.date,
      allowAbsent: true
    }

    if (editingMock) {
      setMockTests(mockTests.map(test =>
        test.id === editingMock.id ? newMockTest : test
      ))
    } else {
      setMockTests([...mockTests, newMockTest])
    }

    setNewMock({ name: '', maxScore: '', date: getTodayDate() })
    setEditingMock(null)
    setShowMockForm(false)
  }

  // Update the score input component
  const handleScoreChange = (student, testId, value) => {
    const test = mockTests.find(t => t.id === testId)
    const isAbsent = value === 'absent'
    const score = isAbsent ? 0 : parseInt(value)

    if (!isAbsent && (isNaN(score) || score < 0 || score > test.maxScore)) {
      return
    }

    const updatedMockScores = [
      ...(student.mockScores || []).filter(s => s.mockId !== testId),
      {
        mockId: testId,
        score: score,
        date: test.date,
        absent: isAbsent
      }
    ]

    setStudents(students.map(s =>
      s.id === student.id
        ? { ...s, mockScores: updatedMockScores }
        : s
    ))
  }

  // Add new state for expanded menu
  const [expandedMenu, setExpandedMenu] = useState('')

  // Add this function to handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudent({
          ...newStudent,
          image: file,
          imageUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this new state at the top with other states
  const [showStudentDetails, setShowStudentDetails] = useState(false)

  // Add this function to handle card click
  const handleCardClick = (student) => {
    setSelectedStudent(student)
    setShowStudentDetails(true)
  }

  // First, add these state variables at the top with other states
  const [currentBatch, setCurrentBatch] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
  })

  const [editingBatch, setEditingBatch] = useState(null)
  const [showBatchForm, setShowBatchForm] = useState(false)

  // Add helper function to format time
  const formatTime = (time) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  // Add helper function to calculate batch progress
  const calculateBatchProgress = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()

    const total = end - start
    const elapsed = today - start

    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)))
  }

  // Add helper function to get batch status color
  const getBatchStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Simplified newBatch state
  const [newBatch, setNewBatch] = useState({
    name: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [],
    trainer: '' // Add trainer field
  })

  // First, add this new state near your other state declarations
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null)

  // Add state for selected date and selected batch for attendance
  const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
  const [selectedAttendanceBatch, setSelectedAttendanceBatch] = useState('');

  // Add state for managing attendance submission
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);

  // Function to handle attendance submission
  const handleAttendanceSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!selectedBatch || (attendanceFilterType === 'single' && !selectedDate) || 
        (attendanceFilterType === 'range' && (!attendanceDateRange.start || !attendanceDateRange.end))) {
      setAlertMessage('Please select all required fields');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      // Get all students from the selected batch
      const filteredStudents = students.filter(student => 
        student.batch?.toString() === selectedBatch?.toString()
      );

      if (filteredStudents.length === 0) {
        setAlertMessage('No students found in this batch');
        setAlertType('warning');
        setShowAlert(true);
        return;
      }

      // Initialize attendance structure for each student
      const studentsWithAttendance = filteredStudents.map(student => ({
        ...student,
        attendance: student.attendance || { class: [], scrum: [] },
        // Add computed attendance for the selected date range
        attendanceInRange: getAttendanceForDateRange(student)
      }));

      setAttendanceStudents(studentsWithAttendance);
      setShowAttendanceTable(true);

    } catch (error) {
      console.error('Error loading attendance:', error);
      setAlertMessage('Failed to load attendance data');
      setAlertType('error');
      setShowAlert(true);
    }
  }

  // Add this helper function to get attendance for date range
  const getAttendanceForDateRange = (student) => {
    if (attendanceFilterType === 'single') {
      return [{
        date: selectedDate,
        present: student.attendance?.class?.find(a => a.date === selectedDate)?.present || false
      }];
    }

    const dates = [];
    const start = new Date(attendanceDateRange.start);
    const end = new Date(attendanceDateRange.end);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      dates.push({
        date: dateStr,
        present: student.attendance?.class?.find(a => a.date === dateStr)?.present || false
      });
    }
    
    return dates;
  }

  // Add this function if missing
  const markAttendance = async (studentId, present) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      const student = attendanceStudents.find(s => s.id === studentId);
      
      if (!student) {
        throw new Error('Student not found');
      }

      // Create new attendance record
      const newAttendance = {
        date: selectedDate,
        present: present
      };

      // Update attendance in state first
      const updatedStudents = students.map(s => {
        if (s.id === studentId) {
          const existingAttendance = s.attendance?.class || [];
          const filteredAttendance = existingAttendance.filter(a => a.date !== selectedDate);
          return {
            ...s,
            attendance: {
              ...s.attendance,
              class: [...filteredAttendance, newAttendance].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
              )
            }
          };
        }
        return s;
      });

      // Update both students and attendanceStudents states
      setStudents(updatedStudents);
      setAttendanceStudents(updatedStudents.filter(s => 
        s.batch?.toString() === selectedBatch?.toString()
      ));

      // Then update in Firebase
      await updateDoc(studentRef, {
        attendance: {
          ...student.attendance,
          class: [...(student.attendance?.class || [])
            .filter(a => a.date !== selectedDate), 
            newAttendance
          ].sort((a, b) => new Date(b.date) - new Date(a.date))
        }
      });

      setAlertMessage(`Attendance marked ${present ? 'present' : 'absent'} for ${student.name}`);
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    } catch (error) {
      console.error('Error marking attendance:', error);
      setAlertMessage('Failed to mark attendance');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Add these alert states if missing
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Add these new states
  const [newMockTest, setNewMockTest] = useState({
    name: '',
    maxScore: '',
    date: getTodayDate(),
    description: '',
    batches: [] // Changed from single batch to array of batches
  });

  // Calculate average attendance
  const calculateAverageAttendance = () => {
    const filteredStudents = students.filter(student =>
      !selectedBatch || student.batch?.toString() === selectedBatch
    );

    if (filteredStudents.length === 0) return 0;

    const attendancePercentages = filteredStudents.map(student => {
      const records = student.attendance?.class || [];
      const recordsInRange = records.filter(record =>
        record.date >= dateRange.start && record.date <= dateRange.end
      );
      const totalDays = recordsInRange.length;
      const presentDays = recordsInRange.filter(record => record.present).length;
      return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    });

    const averageAttendance = attendancePercentages.reduce((a, b) => a + b, 0) / attendancePercentages.length;
    return averageAttendance.toFixed(1);
  };

  // Add this new state for the selected student's attendance details
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);

  // Add this new function to handle batch deletion
  const handleDeleteBatch = async (batchId, batchName) => {
    if (!confirm(`Are you sure you want to delete batch "${batchName}"? This will remove the batch from all enrolled students.`)) {
      return;
    }

    try {
      // Delete the batch
      await deleteDoc(doc(db, 'batches', batchId));

      // Update all students who were in this batch
      const studentsToUpdate = students.filter(
        student => student.batch?.toString() === batchName?.toString()
      );

      for (const student of studentsToUpdate) {
        const studentRef = doc(db, 'students', student.id);
        await updateDoc(studentRef, {
          batch: '',
          attendance: {
            ...student.attendance,
            class: student.attendance.class.filter(record =>
              // Keep attendance records that aren't from this batch's days
              !batches.find(b => b.id === batchId)?.daysOfWeek
                .includes(new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }))
            )
          }
        });
      }

      setAlertMessage('Batch deleted successfully');
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      // Refresh data
      await fetchBatches();
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting batch:', error);
      setAlertMessage('Failed to delete batch. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Add this new state for showing batch students
  const [selectedBatchForStudents, setSelectedBatchForStudents] = useState(null);

  // Add this new state for student list view type
  const [studentListView, setStudentListView] = useState('grid'); // 'grid' or 'list'

  // Add this after your other state declarations
  const [mockTests, setMockTests] = useState([
    {
      id: 1,
      name: 'Mock Test 1',
      date: getTodayDate(),
      maxScore: 100
    }
  ]);
  const [currentMockTest, setCurrentMockTest] = useState(null);
  const [showMockForm, setShowMockForm] = useState(false);

  // Move handleCreateMock before the JSX
  const handleCreateMock = async (e) => {
    e.preventDefault();
    
    try {
      // Create a new mock test document in Firebase
      const mockTestRef = collection(db, 'mockTests');
      const newMockData = {
        ...newMockTest,
        createdAt: new Date().toISOString(),
        maxScore: Number(newMockTest.maxScore),
        students: [] // Will store student scores later
      };

      const docRef = await addDoc(mockTestRef, newMockData);

      // Update local state
      setMockTests([...mockTests, { id: docRef.id, ...newMockData }]);

      // Reset form
      setNewMockTest({
        name: '',
        maxScore: '',
        date: getTodayDate(),
        description: '',
        batches: []
      });

      // Show success message
      setAlertMessage('Mock test created successfully');
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    } catch (error) {
      console.error('Error creating mock test:', error);
      setAlertMessage('Failed to create mock test');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Add fetchMockTests function
  const fetchMockTests = async () => {
    try {
      const mockTestsRef = collection(db, 'mockTests');
      const querySnapshot = await getDocs(mockTestsRef);
      const mockTestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMockTests(mockTestsData);
    } catch (error) {
      console.error('Error fetching mock tests:', error);
    }
  };

  // Add useEffect for fetching mock tests
  useEffect(() => {
    fetchMockTests();
  }, []);

  // Add these new states for mock test filtering and sorting
  const [mockSearchTerm, setMockSearchTerm] = useState('');
  const [mockBatchFilter, setMockBatchFilter] = useState('');
  const [mockSortBy, setMockSortBy] = useState('date-desc');

  // Add these handler functions for mock test management
  const handleEditMock = (mock) => {
    setCurrentMockTest(mock);
    setNewMockTest(mock);
    setCurrentView('mock-create');
  };

  const handleDeleteMock = async (mockId) => {
    if (!window.confirm('Are you sure you want to delete this mock test?')) return;

    try {
      await deleteDoc(doc(db, 'mockTests', mockId));
      setMockTests(mockTests.filter(test => test.id !== mockId));
      setAlertMessage('Mock test deleted successfully');
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error deleting mock test:', error);
      setAlertMessage('Failed to delete mock test');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // First, add a new state for the assign mock view
  const [selectedMockForAssignment, setSelectedMockForAssignment] = useState(null);
  const [mockAssignmentFilter, setMockAssignmentFilter] = useState('');
  const [expandedBatches, setExpandedBatches] = useState({});

  // Add the new Assign Mock view
  {currentView === 'mock-assign' && (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
        <div className="p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assign Mock Test</h2>
          <p className="text-sm text-gray-600 mt-1">Assign scores to students for mock tests</p>
        </div>

        <div className="p-6">
          {/* Mock Test Filter Section */}
          <div className="mb-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mock Test
                </label>
                <div className="relative">
              <input
                type="text"
                    className={inputStyle}
                    placeholder="Search mock tests..."
                    value={mockAssignmentFilter}
                    onChange={(e) => setMockAssignmentFilter(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
            </div>
            </div>
          </div>
        </div>

            {/* Mock Tests List */}
            <div className="mt-4 space-y-4">
          {mockTests
                .filter(test => 
                  test.name.toLowerCase().includes(mockAssignmentFilter.toLowerCase()) ||
                  test.description?.toLowerCase().includes(mockAssignmentFilter.toLowerCase())
                )
            .map(test => (
              <div
                key={test.id}
                    className={`p-4 rounded-lg border ${
                      selectedMockForAssignment?.id === test.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    } cursor-pointer transition-all duration-200`}
                    onClick={() => setSelectedMockForAssignment(test)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{test.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Date: {new Date(test.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Max Score: {test.maxScore}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {test.batches?.map(batch => (
                          <span
                            key={batch}
                            className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                          >
                            Batch {batch}
                    </span>
                        ))}
                  </div>
                    </div>
                    </div>
                ))}
                  </div>
                </div>

          {/* Selected Mock Test Students Section */}
          {selectedMockForAssignment && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assign Scores - {selectedMockForAssignment.name}
              </h3>
              
              {selectedMockForAssignment.batches?.map(batchName => {
                const batchStudents = students.filter(s => s.batch === batchName);
                const isExpanded = expandedBatches[batchName];

                return (
                  <div key={batchName} className="mb-4">
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedBatches(prev => ({
                        ...prev,
                        [batchName]: !prev[batchName]
                      }))}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <h4 className="font-medium text-gray-900">Batch {batchName}</h4>
                        <span className="text-sm text-gray-600">({batchStudents.length} students)</span>
                  </div>
                </div>

                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        {batchStudents.map(student => {
                          const currentScore = student.mockScores?.find(
                            s => s.testId === selectedMockForAssignment.id
                          )?.score || '';

                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                  <span className="text-orange-600 font-medium">
                                    {student.name.charAt(0)}
                                  </span>
              </div>
                                <div>
                                  <p className="font-medium text-gray-900">{student.name}</p>
                                  <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
        </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={selectedMockForAssignment.maxScore}
                                  value={currentScore}
                                  onChange={(e) => handleScoreChange(student, selectedMockForAssignment.id, e.target.value)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Score"
                                />
                                <span className="text-sm text-gray-600">
                                  / {selectedMockForAssignment.maxScore}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={updateBulkMockScore}
                  className={primaryButtonStyle}
                >
                  Save All Scores
                </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )}

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white shadow-lg p-4 space-y-2">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Career Sure Academy
          </h1>
        </div>

        {/* Students Section */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedMenu(expandedMenu === 'students' ? '' : 'students')}
            className={`${sidebarButtonStyle} flex items-center justify-between w-full ${currentView.startsWith('students') ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
              }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Students</span>
            </div>
            <svg
              className={`w-4 h-4 transform transition-transform ${expandedMenu === 'students' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Students Submenu */}
          <div className={`pl-4 space-y-1 ${expandedMenu === 'students' ? 'block' : 'hidden'}`}>
            <button
              onClick={() => {
                setCurrentView('students-view')
                setShowForm(false)
              }}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'students-view' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
                }`}
            >
              View Students
            </button>

            <button
              onClick={() => {
                setCurrentView('students-add')
                setShowForm(true)
              }}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'students-add' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
                }`}
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Batches Section */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedMenu(expandedMenu === 'batches' ? '' : 'batches')}
            className={`${sidebarButtonStyle} flex items-center justify-between w-full ${currentView.startsWith('batches') ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
              }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Batches
            </div>
            <svg
              className={`w-4 h-4 transform transition-transform ${expandedMenu === 'batches' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Batches Submenu */}
          <div className={`pl-4 space-y-1 ${expandedMenu === 'batches' ? 'block' : 'hidden'}`}>
            <button
              onClick={() => setCurrentView('batches-view')}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'batches-view' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
                }`}
            >
              View Batches
            </button>

            <button
              onClick={() => {
                setCurrentView('batches-add')
                setShowBatchForm(true)
              }}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'batches-add' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
                }`}
            >
              Add Batch
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setExpandedMenu(expandedMenu === 'attendance' ? '' : 'attendance')}
            className={`${sidebarButtonStyle} flex items-center justify-between w-full ${currentView.startsWith('attendance') ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
              }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Attendance
            </div>
            <svg
              className={`w-4 h-4 transform transition-transform ${expandedMenu === 'attendance' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Attendance Submenu */}
          <div className={`pl-4 space-y-1 ${expandedMenu === 'attendance' ? 'block' : 'hidden'}`}>
            <button
              onClick={() => setCurrentView('students-attendance')}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'students-attendance' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'}`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setCurrentView('attendance-report')}
              className={`${sidebarButtonStyle} text-sm ${currentView === 'attendance-report' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'}`}
            >
              View Mock
            </button>
          </div>
        </div>

        {/* Add this after the Attendance section, before the closing sidebar div */}
        {/* Mock Tests Section */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedMenu(expandedMenu === 'mock' ? '' : 'mock')}
            className={`${sidebarButtonStyle} flex items-center justify-between w-full ${
              currentView.startsWith('mock') ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mock Tests
            </div>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                expandedMenu === 'mock' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mock Tests Submenu */}
          <div className={`pl-4 space-y-1 ${expandedMenu === 'mock' ? 'block' : 'hidden'}`}>
            <button
              onClick={() => setCurrentView('mock-create')}
              className={`${sidebarButtonStyle} text-sm ${
                currentView === 'mock-create' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
              }`}
            >
              Create Mock
            </button>
            <button
              onClick={() => setCurrentView('mock-report')}
              className={`${sidebarButtonStyle} text-sm ${
                currentView === 'mock-report' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600'
              }`}
            >
              View Mock
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Remove the p-4 class from this div */}
        <div className="h-full">
          {/* Content Area */}
          <div className="w-full">
            {currentView === 'students-view' && (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Students</h2>
                      <p className="text-gray-600 mt-1">View and manage all students</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentView('students-add');
                          setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                          transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Student
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name or roll number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300
                            focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                            transition-all duration-200"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Batch</label>
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                          focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                          transition-all duration-200"
                      >
                        <option value="">All Batches</option>
                        {batches.map(batch => (
                          <option key={batch.id} value={batch.name}>
                            Batch {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStudentListView('grid')}
                          className={`flex-1 px-4 py-2.5 rounded-lg border ${
                            studentListView === 'grid'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          Grid View
                        </button>
                        <button
                          onClick={() => setStudentListView('list')}
                          className={`flex-1 px-4 py-2.5 rounded-lg border ${
                            studentListView === 'list'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          List View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students List */}
                <div className={`${studentListView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                  {students
                    .filter(student => {
                      const searchLower = searchTerm.toLowerCase();
                      const matchesSearch = !searchTerm || 
                        student.name?.toLowerCase().includes(searchLower) ||
                        student.rollNumber?.toLowerCase().includes(searchLower);
                      const matchesBatch = !selectedBatch || 
                        student.batch?.toString() === selectedBatch?.toString();
                      return matchesSearch && matchesBatch;
                    })
                    .map(student => (
                      <div
                        key={student.id}
                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${cardHoverStyle}`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {student.imageUrl ? (
                                <img
                                  src={student.imageUrl}
                                  alt={student.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                              {student.batch && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                  Batch {student.batch}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingStudent(student);
                                setNewStudent(student);
                                setCurrentView('students-add');
                                setShowForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStudent(student.id);
                              }}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Empty State */}
                {students.filter(student => {
                  const searchLower = searchTerm.toLowerCase();
                  const matchesSearch = !searchTerm || 
                    student.name?.toLowerCase().includes(searchLower) ||
                    student.rollNumber?.toLowerCase().includes(searchLower);
                  const matchesBatch = !selectedBatch || 
                    student.batch?.toString() === selectedBatch?.toString();
                  return matchesSearch && matchesBatch;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-600">
                      {searchTerm && selectedBatch
                        ? `No students found matching "${searchTerm}" in Batch ${selectedBatch}`
                        : searchTerm
                          ? `No students found matching "${searchTerm}"`
                          : selectedBatch
                            ? `No students found in Batch ${selectedBatch}`
                            : 'No students available'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Add/Edit Student Form */}
            {currentView === 'students-add' && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                {/* Form Header */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {editingStudent ? 'Edit Student Details' : 'Add New Student'}
                  </h2>
                  <p className="text-sm">
                    {editingStudent
                      ? 'Update the information for existing student'
                      : 'Fill in the information to register a new student'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Image Upload Section */}
                  <div className="flex justify-center mb-8">
                    <div className="w-40 h-40 relative group">
                      <div className={`
                        w-full h-40 rounded-full border-3 border-dashed
                        flex items-center justify-center overflow-hidden
                        transition-all duration-300 shadow-sm
                        ${newStudent.imageUrl
                          ? 'border-transparent'
                          : 'border-gray-300 group-hover:border-orange-300 bg-gray-50'}
                      `}>
                        {newStudent.imageUrl ? (
                          <img
                            src={newStudent.imageUrl}
                            alt="Student"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover:text-orange-400 transition-colors duration-300"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-sm text-gray-500 group-hover:text-orange-500 transition-colors duration-300">
                              Upload Photo
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Click to browse</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload student image"
                      />
                      {newStudent.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setNewStudent({ ...newStudent, image: null, imageUrl: '' })}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-2
                            hover:bg-red-200 transition-colors duration-300 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter student's full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Roll Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newStudent.rollNumber}
                          onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter roll number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newStudent.gender}
                          onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200 bg-white"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Batch <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={newStudent.batch || ''}
                          onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200 bg-white"
                          required
                        >
                          <option value="">Select a batch</option>
                          {batches.map(batch => (
                            <option key={batch.id} value={batch.name}>
                              Batch {batch.name} ({formatTime(batch.startTime)} - {formatTime(batch.endTime)})
                            </option>
                          ))}
                        </select>
                        {batches.length === 0 && (
                          <p className="mt-2 text-sm text-orange-600">
                            No batches available. Please create a batch first.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={newStudent.contactNumber || ''}
                          onChange={(e) => setNewStudent({ ...newStudent, contactNumber: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter contact number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={newStudent.email || ''}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-8 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg
                        font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('students-view')
                        setShowForm(false)
                        setEditingStudent(null)
                        setNewStudent({
                          name: '',
                          rollNumber: '',
                          batch: '',
                          gender: '',
                          contactNumber: '',
                          email: '',
                          image: null,
                          imageUrl: '',
                          attendance: { scrum: [], class: [] }
                        })
                      }}
                      className="px-6 py-3 rounded-lg border border-gray-200 font-medium text-gray-600
                        hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add/Edit Batch Form */}
            {currentView === 'batches-add' && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                {/* Form Header */}
                <div className="mb-8 border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {editingBatch ? 'Edit Batch Details' : 'Create New Batch'}
                  </h2>
                  <p className="text-sm">
                    {editingBatch
                      ? 'Update the information for existing batch'
                      : 'Fill in the details to create a new batch'}
                  </p>
                </div>

                <form onSubmit={handleBatchSubmit} className="space-y-8">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newBatch.name}
                          onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter batch name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trainer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newBatch.trainer}
                          onChange={(e) => setNewBatch({ ...newBatch, trainer: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                            focus:border-orange-400 transition-colors duration-200"
                          placeholder="Enter trainer name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch Timing <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={newBatch.startTime}
                              onChange={(e) => setNewBatch({ ...newBatch, startTime: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                                focus:border-orange-400 transition-colors duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">End Time</label>
                            <input
                              type="time"
                              value={newBatch.endTime}
                              onChange={(e) => setNewBatch({ ...newBatch, endTime: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                                focus:border-orange-400 transition-colors duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days of Week <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <label key={day} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 
                              transition-colors duration-200 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newBatch.daysOfWeek.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewBatch({
                                      ...newBatch,
                                      daysOfWeek: [...newBatch.daysOfWeek, day]
                                    });
                                  } else {
                                    setNewBatch({
                                      ...newBatch,
                                      daysOfWeek: newBatch.daysOfWeek.filter(d => d !== day)
                                    });
                                  }
                                }}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-700">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add this in the batch form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={batchStartDate}
                      onChange={(e) => setBatchStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 
                        focus:border-orange-400 transition-colors duration-200"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-8 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg
                        font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {editingBatch ? 'Update Batch' : 'Create Batch'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('batches-view')
                        setShowBatchForm(false)
                        setEditingBatch(null)
                        setNewBatch({
                          name: '',
                          startTime: '',
                          endTime: '',
                          daysOfWeek: [],
                          trainer: ''
                        })
                      }}
                      className="px-6 py-3 rounded-lg border border-gray-200 font-medium text-gray-600
                        hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Batches View */}
            {currentView === 'batches-view' && (
              <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Batches</h2>
                      <p className="text-gray-600 mt-1">Manage your training batches and schedules</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-600">Total Batches</p>
                        <p className="text-2xl font-bold text-blue-600">{batches.length}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowBatchForm(true);
                          setCurrentView('batches-add');
                          setEditingBatch(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                          transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Batch
                      </button>
                    </div>
                  </div>
                </div>

                {/* Batches Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {batches.map(batch => (
                    <div key={batch.id}
                      onClick={() => setSelectedBatchForStudents(batch)}
                      className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden 
                        hover:shadow-md transition-all duration-300 group cursor-pointer"
                    >
                      {/* Batch Header */}
                      <div className="p-6 bg-gradient-to-r from-blue-50/50 to-white border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Active
                              </span>
                              <span className="text-sm text-gray-500">
                                Started {new Date(batch.startDate).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Batch {batch.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {batch.startTime} - {batch.endTime}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => {
                                setEditingBatch(batch);
                                setNewBatch({
                                  name: batch.name,
                                  startTime: batch.startTime,
                                  endTime: batch.endTime,
                                  daysOfWeek: batch.daysOfWeek,
                                  trainer: batch.trainer
                                });
                                setBatchStartDate(batch.startDate || getTodayDate());
                                setShowBatchForm(true);
                                setCurrentView('batches-add');
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 
                                rounded-lg hover:bg-blue-50"
                              title="Edit Batch"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBatch(batch.id, batch.name);
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200 
                                rounded-lg hover:bg-red-50"
                              title="Delete Batch"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Batch Details */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Trainer Info */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Trainer</p>
                                <p className="text-sm text-gray-600">{batch.trainer}</p>
                              </div>
                            </div>
                          </div>

                          {/* Schedule */}
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium text-gray-900">Schedule</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {batch.daysOfWeek.map(day => (
                                <span key={day}
                                  className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium"
                                >
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Students Count */}
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Students</p>
                                <p className="text-2xl font-bold text-purple-600">
                                  {students.filter(s => s.batch?.toString() === batch.name?.toString()).length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {batches.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Found</h3>
                    <p className="text-gray-600">Create your first batch to get started.</p>
                  </div>
                )}
              </div>
            )}

            {currentView === 'students-attendance' && (
              <div className="space-y-6 mx-auto">
                {/* Attendance Form Card */}
                <div className={`${attendanceCardStyle} p-6`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
                      <p className="text-sm text-gray-600">Mark and manage student attendance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection with Navigation Arrows */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Date</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentDate = new Date(selectedDate);
                            const newDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                            
                            // Get the batch start date
                            const selectedBatchData = batches.find(b => b.name === selectedBatch);
                            const batchStartDate = selectedBatchData ? new Date(selectedBatchData.startDate) : new Date();
                            
                            // Only allow navigation if new date is not before batch start date
                            if (newDate >= batchStartDate) {
                              setSelectedDate(newDate.toISOString().split('T')[0]);
                            }
                          }}
                          disabled={!selectedBatch || selectedDate <= (batches.find(b => b.name === selectedBatch)?.startDate || selectedDate)}
                          className={`p-2 rounded-lg ${!selectedBatch || selectedDate <= (batches.find(b => b.name === selectedBatch)?.startDate || selectedDate)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <div className="relative flex-1">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                              const newDate = new Date(e.target.value);
                              const selectedBatchData = batches.find(b => b.name === selectedBatch);
                              const batchStartDate = selectedBatchData ? new Date(selectedBatchData.startDate) : new Date();
                              
                              // Only allow date selection if it's not before batch start date
                              if (!selectedBatch || newDate >= batchStartDate) {
                                setSelectedDate(e.target.value);
                              }
                            }}
                            min={selectedBatch ? batches.find(b => b.name === selectedBatch)?.startDate : undefined}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                              focus:ring-2 focus:ring-blue-200 focus:border-blue-400 
                              transition-all duration-200"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const currentDate = new Date(selectedDate);
                            const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                            
                            // Don't allow navigation beyond today
                            if (newDate <= new Date()) {
                              setSelectedDate(newDate.toISOString().split('T')[0]);
                            }
                          }}
                          disabled={selectedDate >= new Date().toISOString().split('T')[0]}
                          className={`p-2 rounded-lg ${selectedDate >= new Date().toISOString().split('T')[0]
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Show batch start date info if selected */}
                      {selectedBatch && (
                        <p className="text-sm text-gray-500 mt-1">
                          Batch started on {new Date(batches.find(b => b.name === selectedBatch)?.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Batch Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Batch</label>
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                        focus:ring-2 focus:ring-blue-200 focus:border-blue-400 
                        transition-all duration-200 bg-white"
                      >
                        <option value="">Select a batch</option>
                        {batches.map(batch => (
                          <option key={batch.id} value={batch.name}>
                            Batch {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleAttendanceSubmit}
                    disabled={!selectedDate || !selectedBatch}
                    className={`mt-6 w-full px-6 py-3 rounded-lg font-medium text-white
                    transition-all duration-300 transform hover:-translate-y-0.5
                    ${(!selectedDate || !selectedBatch)
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>View Attendance Sheet</span>
                    </div>
                  </button>

                  {/* Attendance Table */}
                  {showAttendanceTable && attendanceStudents.length > 0 && (
                    <div className={attendanceCardStyle}>
                      <div className={attendanceHeaderStyle}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              Attendance Sheet - Batch {selectedBatch}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {attendanceStudents.length} Students
                            </span>
                            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {attendanceStudents.filter(s =>
                                s.attendance?.class?.find(r => r.date === selectedDate)?.present
                              ).length} Present
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className={attendanceTableStyle}>
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Roll Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mark Attendance
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {attendanceStudents.map(student => {
                              const isPresent = student.attendance?.class?.find(
                                record => record.date === selectedDate
                              )?.present;

                              return (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 flex-shrink-0">
                                        {student.imageUrl ? (
                                          <img
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                            src={student.imageUrl}
                                            alt={student.name}
                                          />
                                        ) : (
                                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{student.name}</div>
                                        <div className="text-sm text-gray-500">{student.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{student.rollNumber}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => markAttendance(student.id, true)}
                                        className={attendanceButtonStyle(isPresent === true, 'present')}
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Present
                                      </button>
                                      <button
                                        onClick={() => markAttendance(student.id, false)}
                                        className={attendanceButtonStyle(isPresent === false, 'absent')}
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Absent
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${isPresent === true
                                        ? 'bg-green-100 text-green-800'
                                        : isPresent === false
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-800'}`}
                                    >
                                      {isPresent === true ? 'Present' : isPresent === false ? 'Absent' : 'Not Marked'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* No Students Message */}
                  {showAttendanceTable && attendanceStudents.length === 0 && (
                    <div className={`${attendanceCardStyle} p-8 text-center`}>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="bg-gray-50 rounded-full p-4 mb-4">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                        <p className="text-gray-500 max-w-sm">
                          There are no students enrolled in this batch. Add students to the batch to start marking attendance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'attendance-report' && (
              <div className="bg-white min-h-screen">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
                  <div className="px-8 py-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Attendance Report</h2>
                        <p className="text-base text-gray-600 mt-1">Track and analyze student attendance records</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="px-6 py-3 bg-white rounded-xl shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-gray-600">Total Students</p>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            {students.filter(student => !selectedBatch || student.batch?.toString() === selectedBatch).length}
                          </p>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-xl shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            {calculateAverageAttendance()}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                          <select
                            value={selectedBatch}
                            onChange={(e) => {
                              const batch = batches.find(b => b.name === e.target.value);
                              setSelectedBatch(e.target.value);
                              // Set the start date to batch creation date when batch is selected
                              if (batch) {
                                setDateRange({
                                  ...dateRange,
                                  start: batch.startDate || getTodayDate()
                                });
                              }
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 
                              focus:border-blue-400 text-base bg-white shadow-sm"
                          >
                            <option value="">All Batches</option>
                            {batches.map(batch => (
                              <option key={batch.id} value={batch.name}>
                                Batch {batch.name} ({students.filter(s => s.batch?.toString() === batch.name?.toString()).length})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
                          <div className="flex gap-4 mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                value="range"
                                checked={filterType === 'range'}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                              />
                              <span className="ml-2 text-sm text-gray-700">Date Range</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                value="single"
                                checked={filterType === 'single'}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                              />
                              <span className="ml-2 text-sm text-gray-700">Today</span>
                            </label>
                          </div>
                        </div>

                        {filterType === 'range' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                              <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 
                                  focus:border-blue-400 text-base bg-white shadow-sm"
                                // Disable the input if a batch is selected
                                disabled={!!selectedBatch}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                              <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 
                                  focus:border-blue-400 text-base bg-white shadow-sm"
                              />
                            </div>
                          </>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                            <input
                              type="date"
                              value={singleDate}
                              onChange={(e) => setSingleDate(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 
                                focus:border-blue-400 text-base bg-white shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add new Tabular Report Section */}
                <div className="p-8">
                  {selectedBatch && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Detailed Attendance Report - Batch {selectedBatch}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {filterType === 'range' 
                            ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
                            : new Date(singleDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              {filterType === 'range' ? (
                                <>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Present Days
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Days
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Attendance %
                                  </th>
                                </>
                              ) : (
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              )}
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {students
                              .filter(student => !selectedBatch || student.batch?.toString() === selectedBatch)
                              .map(student => {
                                const attendanceRecords = student.attendance?.class || [];
                                const recordsInRange = filterType === 'range'
                                  ? attendanceRecords.filter(record =>
                                      record.date >= dateRange.start && record.date <= dateRange.end
                                    )
                                  : attendanceRecords.filter(record => record.date === singleDate);

                                const totalDays = recordsInRange.length;
                                const presentDays = recordsInRange.filter(record => record.present).length;
                                const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

                                return (
                                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                          {student.imageUrl ? (
                                            <img
                                              className="h-10 w-10 rounded-full object-cover"
                                              src={student.imageUrl}
                                              alt={student.name}
                                            />
                                          ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                          <div className="text-sm text-gray-500">Roll No: {student.rollNumber}</div>
                                        </div>
                                      </div>
                                    </td>
                                    
                                    {filterType === 'range' ? (
                                      <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {presentDays}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {totalDays}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                              attendancePercentage >= 75 ? 'bg-green-100 text-green-800' :
                                              attendancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                            }`}>
                                              {attendancePercentage.toFixed(1)}%
                                            </span>
                                          </div>
                                        </td>
                                      </>
                                    ) : (
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {recordsInRange[0]?.present ? (
                                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Present
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Absent
                                          </span>
                                        )}
                                      </td>
                                    )}

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={() => {
                                          setSelectedStudent(student);
                                          setShowAttendanceDetails(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        View Details
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Summary Footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div>
                            Total Students: {students.filter(s => s.batch?.toString() === selectedBatch).length}
                          </div>
                          <div>
                            Average Attendance: {calculateAverageAttendance()}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keep the existing empty state for when no batch is selected */}
                  {!selectedBatch && (
                    <div className="text-center py-12">
                      <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Batch</h3>
                      <p className="text-gray-600">Choose a batch to view attendance records.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mock Tests */}
            {currentView === 'mock' && (
              <div className="space-y-6 max-w-7xl mx-auto px-4">
                {/* Header Card */}
                <div className={mockTestCardStyle}>
                  <div className={mockTestHeaderStyle}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">Mock</h2>
                          <p className="text-sm text-gray-600">Manage tests and track student performance</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMockForm(true)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700
                          transition-all duration-300 flex items-center gap-2 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create Mock Test
                      </button>
                    </div>
                  </div>

                  {/* Search and Filter Section */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Search Tests</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by test name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300
                              focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                              transition-all duration-200"
                          />
                          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Filter by Test</label>
                        <select
                          value={selectedMock}
                          onChange={(e) => setSelectedMock(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                            focus:ring-2 focus:ring-purple-200 focus:border-purple-400
                            transition-all duration-200"
                        >
                          <option value="">All Tests</option>
                          {mockTests.map(test => (
                            <option key={test.id} value={test.id}>
                              {test.name} ({formatDate(test.date)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mock Tests List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockTests
                        .filter(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(test => (
                          <div key={test.id}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg">
                                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{test.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    Date: {formatDate(test.date)} • Max Score: {test.maxScore}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {students.filter(s => s.mockScores.some(score => score.mockId === test.id)).length} Submissions
                                </span>
                                <button
                                  onClick={() => handleEditTest(test)}
                                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Student Scores Card */}
                <div className={mockTestCardStyle}>
                  <div className={mockTestHeaderStyle}>
                    <h3 className="text-lg font-semibold text-gray-800">Student Performance</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {students
                        .filter(student => {
                          const searchLower = searchTerm.toLowerCase();
                          return !searchTerm ||
                            student.name?.toLowerCase().includes(searchLower) ||
                            student.rollNumber?.toLowerCase().includes(searchLower);
                        })
                        .map(student => (
                          <div key={student.id}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                                  {student.imageUrl ? (
                                    <img
                                      src={student.imageUrl}
                                      alt={student.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                                  <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {student.mockScores.map(score => {
                                  const test = mockTests.find(t => t.id === score.mockId);
                                  return (
                                    <div key={score.mockId} className="text-center">
                                      <p className="text-sm text-gray-600 mb-1">{test?.name}</p>
                                      <span className={mockScoreStyle(score.score, test?.maxScore)}>
                                        {score.score}/{test?.maxScore}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mock Create View */}
            {currentView === 'mock-create' && (
              <div className="">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 mx-auto">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Create Mock Test</h2>
                    <p className="text-sm text-gray-600 mt-1">Create a new mock test for students</p>
                  </div>

                  <form onSubmit={handleCreateMock} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Mock Test Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Name
                        </label>
                        <input
                          type="text"
                          value={newMockTest.name}
                          onChange={(e) => setNewMockTest({ ...newMockTest, name: e.target.value })}
                          className={inputStyle}
                          placeholder="Enter test name"
                          required
                        />
                      </div>

                      {/* Maximum Score */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Score
                        </label>
                        <input
                          type="number"
                          value={newMockTest.maxScore}
                          onChange={(e) => setNewMockTest({ ...newMockTest, maxScore: e.target.value })}
                          className={inputStyle}
                          placeholder="Enter maximum score"
                          required
                          min="0"
                        />
                      </div>

                      {/* Test Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Date
                        </label>
                        <input
                          type="date"
                          value={newMockTest.date}
                          onChange={(e) => setNewMockTest({ ...newMockTest, date: e.target.value })}
                          className={inputStyle}
                          required
                        />
                      </div>

                      {/* Batch Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Batches
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                          {batches.map(batch => (
                            <label key={batch.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                              <input
                                type="checkbox"
                                checked={newMockTest.batches.includes(batch.name)}
                                onChange={(e) => {
                                  const updatedBatches = e.target.checked
                                    ? [...newMockTest.batches, batch.name]
                                    : newMockTest.batches.filter(b => b !== batch.name);
                                  setNewMockTest({ ...newMockTest, batches: updatedBatches });
                                }}
                                className="rounded text-orange-600 focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-700">Batch {batch.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newMockTest.description}
                          onChange={(e) => setNewMockTest({ ...newMockTest, description: e.target.value })}
                          className={inputStyle}
                          rows="4"
                          placeholder="Enter test description"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setNewMockTest({
                            name: '',
                            maxScore: '',
                            date: getTodayDate(),
                            description: '',
                            batches: []
                          });
                        }}
                        className={secondaryButtonStyle}
                      >
                        Clear Form
                      </button>
                      <button
                        type="submit"
                        className={primaryButtonStyle}
                      >
                        Create Mock Test
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Mock Report View */}
            {currentView === 'mock-report' && (
              <div className="p-6">
                {/* Header Card */}
                <div className={`${cardStyle} mb-6`}>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Mock Tests</h2>
                        <p className="text-gray-600 mt-1">View and manage all mock tests</p>
          </div>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-sm text-gray-600">Total Tests</p>
                          <p className="text-2xl font-bold text-orange-600">{mockTests.length}</p>
                        </div>
                        <button
                          onClick={() => setCurrentView('mock-assign')}
                          className={`${primaryButtonStyle} flex items-center gap-2`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Assign Mock
                        </button>
                        <button
                          onClick={() => setCurrentView('mock-create')}
                          className={`${primaryButtonStyle} flex items-center gap-2`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Create New Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTests.map(test => (
                    <div
                      key={test.id}
                      className={`${cardStyle} overflow-hidden`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                          {test.batches && test.batches.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {test.batches.map(batch => (
                                <span key={batch} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                                  Batch {batch}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(test.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Maximum Score: {test.maxScore}
                          </div>

                          {test.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{test.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            new Date(test.date) > new Date() 
                              ? 'bg-blue-100 text-blue-800'
                              : new Date(test.date).toDateString() === new Date().toDateString()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {new Date(test.date) > new Date() 
                              ? 'Upcoming'
                              : new Date(test.date).toDateString() === new Date().toDateString()
                              ? 'Today'
                              : 'Completed'}
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditMock(test)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMock(test.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {mockTests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No mock tests found</h3>
                    <p className="text-gray-600">Create your first mock test to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* Assign Mock View */}
            {currentView === 'mock-assign' && (
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Assign Mock Test</h2>
                    <p className="text-sm text-gray-600 mt-1">Assign scores to students for mock tests</p>
                  </div>

                  <div className="p-6">
                    {/* Mock Test Filter Section */}
                    <div className="mb-6">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Mock Test
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={inputStyle}
                              placeholder="Search mock tests..."
                              value={mockAssignmentFilter}
                              onChange={(e) => setMockAssignmentFilter(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Tests List */}
                      <div className="mt-4 space-y-4">
                        {mockTests
                          .filter(test => 
                            test.name.toLowerCase().includes(mockAssignmentFilter.toLowerCase()) ||
                            test.description?.toLowerCase().includes(mockAssignmentFilter.toLowerCase())
                          )
                          .map(test => (
                            <div
                              key={test.id}
                              className={`p-4 rounded-lg border ${
                                selectedMockForAssignment?.id === test.id
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-gray-200 hover:border-orange-200'
                              } cursor-pointer transition-all duration-200`}
                              onClick={() => setSelectedMockForAssignment(test)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Date: {new Date(test.date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Max Score: {test.maxScore}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {test.batches?.map(batch => (
                                    <span
                                      key={batch}
                                      className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                    >
                                      Batch {batch}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Selected Mock Test Students Section */}
                    {selectedMockForAssignment && (
                      <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Assign Scores - {selectedMockForAssignment.name}
                        </h3>
                        
                        {selectedMockForAssignment.batches?.map(batchName => {
                          const batchStudents = students.filter(s => s.batch === batchName);
                          const isExpanded = expandedBatches[batchName];

                          return (
                            <div key={batchName} className="mb-4">
                              <div
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setExpandedBatches(prev => ({
                                  ...prev,
                                  [batchName]: !prev[batchName]
                                }))}
                              >
                                <div className="flex items-center gap-2">
                                  <svg
                                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                  <h4 className="font-medium text-gray-900">Batch {batchName}</h4>
                                  <span className="text-sm text-gray-600">({batchStudents.length} students)</span>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-2 space-y-2">
                                  {batchStudents.map(student => {
                                    const currentScore = student.mockScores?.find(
                                      s => s.testId === selectedMockForAssignment.id
                                    )?.score || '';

                                    return (
                                      <div
                                        key={student.id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 font-medium">
                                              {student.name.charAt(0)}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number"
                                            min="0"
                                            max={selectedMockForAssignment.maxScore}
                                            value={currentScore}
                                            onChange={(e) => handleScoreChange(student, selectedMockForAssignment.id, e.target.value)}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Score"
                                          />
                                          <span className="text-sm text-gray-600">
                                            / {selectedMockForAssignment.maxScore}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={updateBulkMockScore}
                            className={primaryButtonStyle}
                          >
                            Save All Scores
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {
        showStudentDetails && selectedStudent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm backdrop-filter rounded-xl max-w-2xl w-full max-h-[90vh] 
            overflow-y-auto p-6 m-4 shadow-xl border border-gray-200/50">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
                <button
                  onClick={() => setShowStudentDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Header */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    {selectedStudent.imageUrl ? (
                      <img
                        src={selectedStudent.imageUrl}
                        alt={selectedStudent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedStudent.name}</h3>
                    <p className="text-gray-600">Roll No: {selectedStudent.rollNumber}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {selectedStudent.contactNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedStudent.contactNumber}
                      </div>
                    )}
                    {selectedStudent.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedStudent.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStudent(selectedStudent);
                      setNewStudent(selectedStudent);
                      setCurrentView('students-add');
                      setShowForm(true);
                      setShowStudentDetails(false);
                    }}
                    className="flex-1 text-green-600 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg font-medium"
                  >
                    Edit Student
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStudent(selectedStudent.id);
                      setShowStudentDetails(false);
                    }}
                    className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium"
                  >
                    Delete Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Simplified Batch Students Modal */}
      {
        selectedBatchForStudents && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full m-4 max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50/50 to-white border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Batch Details
                      </span>
                      <span className="text-sm text-gray-500">
                        Started {new Date(selectedBatchForStudents.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Batch {selectedBatchForStudents.name} Students
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedBatchForStudents.startTime} - {selectedBatchForStudents.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                      <button
                        onClick={() => setStudentListView('grid')}
                        className={`p-2 rounded-md transition-all duration-200 ${studentListView === 'grid'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setStudentListView('list')}
                        className={`p-2 rounded-md transition-all duration-200 ${studentListView === 'list'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedBatchForStudents(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
                <div className="p-6">
                  {/* Search and Filter */}
                  <div className="mb-6 flex gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 
                          focus:ring-blue-100 focus:border-blue-400"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('students-add');
                        setShowForm(true);
                        setSelectedBatchForStudents(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                        transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Student
                    </button>
                  </div>

                  {/* Students Grid/List */}
                  <div className={studentListView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                    {students
                      .filter(student => {
                        const searchLower = searchTerm.toLowerCase();
                        const matchesSearch = !searchTerm || 
                          student.name?.toLowerCase().includes(searchLower) ||
                          student.rollNumber?.toLowerCase().includes(searchLower);
                        const matchesBatch = !selectedBatchForStudents || 
                          student.batch?.toString() === selectedBatchForStudents?.toString();
                        return matchesSearch && matchesBatch;
                      })
                      .map(student => (
                        <div
                          key={student.id}
                          className={`bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 
                            transition-all duration-300 ${studentListView === 'grid'
                              ? 'flex flex-col gap-4'
                              : 'flex items-center gap-4'
                            }`}
                        >
                          {/* Student Image */}
                          <div className={`${studentListView === 'grid'
                              ? 'w-16 h-16'
                              : 'w-12 h-12'
                            } rounded-full overflow-hidden bg-gray-100 flex-shrink-0`}
                          >
                            {student.imageUrl ? (
                              <img
                                src={student.imageUrl}
                                alt={student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Student Info */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-gray-900">{student.name}</h3>
                              <span className="text-sm text-gray-500">Roll No: {student.rollNumber}</span>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-3 mt-2">
                              {student.email && (
                                <a
                                  href={`mailto:${student.email}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {student.email}
                                </a>
                              )}
                              {student.phone && (
                                <a
                                  href={`tel:${student.phone}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {student.phone}
                                </a>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingStudent(student);
                                  setNewStudent(student);
                                  setCurrentView('students-add');
                                  setShowForm(true);
                                  setSelectedBatchForStudents(null);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student.id);
                                }}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* No Results Message */}
                    {students.filter(student => {
                      const searchLower = searchTerm.toLowerCase();
                      const matchesSearch = !searchTerm || 
                        student.name?.toLowerCase().includes(searchLower) ||
                        student.rollNumber?.toLowerCase().includes(searchLower);
                      const matchesBatch = !selectedBatchForStudents || 
                        student.batch?.toString() === selectedBatchForStudents?.toString();
                      return matchesSearch && matchesBatch;
                    }).length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                        <div className="bg-gray-50 rounded-full p-4 mb-4">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                          {searchTerm && selectedBatchForStudents
                            ? `No students found matching "${searchTerm}" in Batch ${selectedBatchForStudents}`
                            : searchTerm
                              ? `No students found matching "${searchTerm}"`
                              : selectedBatchForStudents
                                ? `No students found in Batch ${selectedBatchForStudents}`
                                : 'No students available'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Alert Component */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`rounded-lg shadow-lg p-4 ${alertType === 'success'
            ? 'bg-orange-100 border border-orange-200'
            : 'bg-gray-100 border border-gray-200'
            }`}>
            <div className="flex items-center gap-3">
              {alertType === 'success' ? (
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`font-medium ${alertType === 'success' ? 'text-orange-800' : 'text-gray-800'
                }`}>
                {alertMessage}
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className={`ml-auto p-1 rounded-full ${alertType === 'success'
                  ? 'hover:bg-orange-200'
                  : 'hover:bg-gray-200'
                  } transition-colors duration-200`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAttendanceDetails && selectedStudent && (
        <AttendanceDetailsModal
          student={selectedStudent}
          onClose={() => {
            setShowAttendanceDetails(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  )
}

export default App