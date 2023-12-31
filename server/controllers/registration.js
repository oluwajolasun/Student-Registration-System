const db = require("../models");

const Course = db.models.Courses;
const Student = db.models.Students;
const Registration = db.models.Registration;

const enrollToCourse = async (req, res) => {
  try {
    const { student_id, course_id } = req.params;

    // Check if the student and course exist
    const student = await Student.findByPk(student_id); //from docs findByPk returns a Model object
    const course = await Course.findByPk(course_id);

    console.log(course);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or course not found" });
    }

    const action = await course.addStudent(student); //Special method add{Student}() method is created when using "belongsToMany"
    // console.log(course);
    if (!action) {
      return res
        .status(200)
        .json({ message: "Student already enrolled to course" });
    }
    res.status(200).json({ message: "Student successfully enrolled to course" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ msg: error });
  }
};

const unenrollFromCourse = async (req, res) => {
  try {
    const { student_id, course_id } = req.params;

    // Check if the student and course exist
    const student = await Student.findByPk(student_id); //from docs findByPk returns a Model object
    const course = await Course.findByPk(course_id);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or course not found" });
    }

    let action = await course.removeStudent(student); //Special method add{Student}() method is created when using "belongsToMany"

    if (action === 0) {
      return res
        .status(200)
        .json({ message: "Student not enrolled to course" });
    }
    res
      .status(200)
      .json({ message: "Student unenrolled successfully", student, course });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ msg: error });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const registration = await Registration.findAll(); //From docs model.findall() returns an array of the models
    res.status(200).json({ registration });
  } catch (error) {
    console.error("Error getting enrolling:", error);
    res.status(500).json({ msg: error });
  }
};

const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.params.student_id;

    // Retrieve the student and associated courses using the `include` option
    const student = await Student.findByPk(studentId, {
      include: {
        model: Course,
        through: { attributes: [] }, // Exclude junction table attributes
      },
    });

    console.log(student);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Extract the courses from the student object
    const courses = student.courses;

    if (courses.length === 0) {
      return res
        .status(200)
        .json({ msg: "Student is not enrolled in any course" });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error getting enrollments:", error);
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  enrollToCourse,
  unenrollFromCourse,
  getEnrollments,
  getStudentEnrollments,
};
