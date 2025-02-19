// Trigger functionality only if DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const nextBtns = document.querySelectorAll('.next-btn');
  const backBtns = document.querySelectorAll('.back-btn');
  const questions = document.querySelectorAll('.question');
  const answers = document.querySelectorAll('.choice-btn');
  const name = document.getElementById('name');
  const startBtn = document.getElementById('start');
  const errorMessage = document.getElementById('error');
  const submitBtn = document.getElementById('submit');

  // Initial question preview value
  let count = 0;
  // Object to store user choices
  let data = {};

  // Function to display current question
  function displayQuestion () {
    questions.forEach((question, index) => {
      question.classList.toggle('active', index === count)
    });
  }

  // Disable nextBtn until user make a choice
  if(count > 0 && count < nextBtns.length) {
    nextBtns[count].disabled = true;
  }

  // Disable start button until user input a valid input
  name.addEventListener('input', () => {
    if(!name.value.trim()) {
      errorMessage.style.display = 'block';
      startBtn.disabled = true;
    } else {
      errorMessage.style.display = 'none';
      startBtn.disabled = false;
    }
  })

  // Start assessment only if name is provided, and store user's name
  startBtn.addEventListener('click', () => {
    if(!name.value.trim()) {
      errorMessage.style.display = 'block';
    } else {
      data.name = name.value.trim()
    }
  })

  // Handle user's choices and disable nextBtn until user makes a choice
  answers.forEach(answer => {
    answer.addEventListener('click', (e) => {
      const questionId = questions[count].id;
      const selectedBtn = e.target;
      const parent = selectedBtn.parentElement;

      if (questionId === 'programmingBackground') {
        // Define an array, and allow multiple selection
        if (!data[questionId]) {
          data[questionId] = [];
        }

        if (selectedBtn.classList.contains('selected')) {
          selectedBtn.classList.remove('selected');
          // Delete selection from array
          data[questionId] = data[questionId].filter(choice => choice !== selectedBtn.innerText);;
        } else {
          selectedBtn.classList.add('selected');
          // Store selected choices in the array
          data[questionId].push(selectedBtn.innerText);
        }

        // Remove key if array is empty
        if (data[questionId].length === 0) {
          delete data[questionId];
        }
      } else {
        // Store one choice for the remaining questions and change selected choice
        if (selectedBtn.classList.contains('selected')) {
          selectedBtn.classList.remove('selected');
          // delete selection from data
          delete data[questionId];
        } else {
          parent.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('selected'));
          selectedBtn.classList.add('selected');
          // store selected data
          data[questionId] = selectedBtn.innerText;
        }
      }
      
      // Enable nextBtn if choice is made
      if (parent.querySelector('.selected')) {
        nextBtns[count].disabled = false;
      } else {
        nextBtns[count].disabled = true;
      }
    })
  })


  // Event listener for the next button
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(count < questions.length - 1){
        count++;
        displayQuestion();
      }
    });
  });

  // Event listener for the back button
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(count > 0) {
        count--;
        displayQuestion();
      }
    });
  });

  // Send stored user data to API
  submitBtn.addEventListener('click', async(e) => {
    // Prevent event default behavior
    e.preventDefault();

    try {
      await sendData(data);
    } catch (error) {
      console.log('Error sending data:', error);
    }
  });

  // Function to send user data to API 
  async function sendData(data) {
    const baseUrl = 'http://localhost:3000/submit';

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    if(!response.ok) {
      throw new Error('Failed to send data!');
    }

    const responseData = await response.json()
    console.log('API Response:',responseData);
    return responseData;
  }

  // console.log(data)
  displayQuestion();
})