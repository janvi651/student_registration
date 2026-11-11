let students = [];
let editIndex = -1;
let nextId = 1;

const form = document.getElementById("studentForm");

const fields = [
    "name", "email", "phone",
    "age", "gender", "course"
];

// Clear error messages
function clearErrors() {
    fields.forEach(field => {
        document.getElementById(field + "Error").textContent = "";
    });
}

// Form validation
function validateForm() {
    clearErrors();

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const course = document.getElementById("course").value;

    if (!/^[A-Za-z ]{2,50}$/.test(name)) {
        document.getElementById("nameError").textContent =
            "Enter a valid name.";
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").textContent =
            "Enter a valid email.";
        valid = false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Enter a valid 10-digit phone number.";
        valid = false;
    }

    if (!Number.isInteger(age) || age < 16 || age > 100) {
        document.getElementById("ageError").textContent =
            "Age must be between 16 and 100.";
        valid = false;
    }

    if (!gender) {
        document.getElementById("genderError").textContent =
            "Please select gender.";
        valid = false;
    }

    if (!course) {
        document.getElementById("courseError").textContent =
            "Please select a course.";
        valid = false;
    }

    const duplicate = students.some((student, index) =>
        student.email.toLowerCase() === email.toLowerCase()
        && index !== editIndex
    );

    if (duplicate) {
        document.getElementById("emailError").textContent =
            "Email already registered.";
        valid = false;
    }

    return valid;
}

// Add or Update student
form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        course: document.getElementById("course").value
    };

    if (editIndex === -1) {
        student.id = nextId++;
        students.push(student);
        alert("Student added successfully!");
    } else {
        student.id = students[editIndex].id;
        students[editIndex] = student;
        alert("Student updated successfully!");
    }

    renderStudents();
    resetForm();
});

// Display students
function renderStudents() {
    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (students.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No students registered yet.
                </td>
            </tr>`;
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        [
            student.id,
            student.name,
            student.email,
            student.phone,
            student.age,
            student.gender,
            student.course
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.onclick = () => editStudent(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteStudent(index);

        actions.append(editButton, deleteButton);
        row.appendChild(actions);

        table.appendChild(row);
    });
}

// Edit student
function editStudent(index) {
    const student = students[index];

    fields.forEach(field => {
        document.getElementById(field).value = student[field];
    });

    editIndex = index;

    document.getElementById("formTitle").textContent =
        "Edit Student Details";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete student
function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);

        if (editIndex === index) {
            resetForm();
        } else if (editIndex > index) {
            editIndex--;
        }

        renderStudents();
    }
}

// Reset form
function resetForm() {
    form.reset();
    clearErrors();

    editIndex = -1;

    document.getElementById("formTitle").textContent =
        "Register Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";
}

document.getElementById("resetBtn").addEventListener(
    "click", resetForm
);

renderStudents();
