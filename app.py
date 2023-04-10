from flask import Flask, request, jsonify, render_template, redirect
import json
import random
app = Flask(__name__)
quiz_data = []

# Load questions from JSON file
with open('questions.json') as f:
    data = json.load(f)
    data = data["questions"]



# Endpoint to get random questions for the quiz
@app.route('/quiz', methods=['POST', "GET"])
def quiz():
    global quiz_data
    if (request.method == 'POST'):
        quiz_data = []

        num_questions = int(request.form['num_questions'])

        questions = random.sample(
            data, min(num_questions, len(data)))
        for q in questions:
            q_data = {}
            q_data['question'] = q['question']
            q_data['options'] = random.sample(q['options'], len(q['options'])) # Shuffle options
            q_data['answer'] = q['answer']
            quiz_data.append(q_data)
        return jsonify({'quiz_data': quiz_data})
    else:
        return render_template('quiz.html')


# Endpoint to check answers and calculate score

@app.route('/')
def index():
    return redirect('/quiz')


@app.route('/quiz', methods=['PUT'])
def submit():
    quiz_ans_data = request.get_json()
    print(quiz_ans_data)
    score = 0
    results = []
    for i, q in enumerate(quiz_data):
        q_result = {}
        q_result['question'] = q['question']

        q_result['selected_answer'] = quiz_ans_data[str(i)]
        q_result['correct_answer'] = q['answer']
        if q_result['selected_answer'] == q['answer']:
            q_result['correct'] = True
            score += 1
        else:
            q_result['correct'] = False
        results.append(q_result)
    print(score)
    score_percentage = round(score / len(quiz_ans_data) * 100, 2)
    return jsonify({'score': score_percentage, 'quiz_data': results})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)