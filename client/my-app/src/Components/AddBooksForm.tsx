import React, { useState } from 'react';
import '../AddBooksForm.css'
import { ActionCodeOperation } from 'firebase/auth';

type ChapterQuestions = {
    chapterNumber: number;
    questions: string[];
    answers: string[];
};

type Book = {
    id: number;
    title: string;
    description?: string;
    chapters?: ChapterQuestions[];
    imageUrl?: string;
};

type AddBookFormProps = {
    book: Book;
    onSave: (bookData: Book) => void;
    onClose: () => void;
};

const AddBooksForm: React.FC<AddBookFormProps> = ({ book, onSave, onClose }) => {
    const [title, setTitle] = useState(book.title);
    const [description, setDescription] = useState(book.description || '');
    const [chapters, setChapters] = useState<ChapterQuestions[]>(book.chapters || [{ chapterNumber: 1, questions: [''], answers: [''] }]);
    const [numberOfChapters, setNumberOfChapters] = useState(chapters.length || 1);
    const [activeChapter, setExactChapter] = useState(1);
    const [imageUrl, setImageUrl] = useState(book.imageUrl || '');


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave({
            ...book,
            title,
            description,
            chapters,
            imageUrl,
        });
    };

    const handleChapterQuestionChange = (chapterIndex: number, question: string, questionIndex: number) => {
        const newChapters = [...chapters];
        console.log(activeChapter);
        console.log(chapterIndex);
        console.log(newChapters);
        newChapters[chapterIndex].questions[questionIndex] = question;
        setChapters(newChapters);
    };

    const handleChapterAnswerChange = (chapterIndex: number, answer: string, questionIndex: number) => {
        const newChapters = [...chapters];
        newChapters[chapterIndex].answers[questionIndex] = answer;
        setChapters(newChapters);
    };

    const handleNumberOfChaptersChange = (count: number) => {
        setNumberOfChapters(count);
        const newChapters = Array(count).fill(null).map((_, index) => ({
            chapterNumber: index + 1,
            questions: chapters[index]?.questions || ['Example'],
            answers: chapters[index]?.answers || ['Example']
        }));
        setChapters(newChapters);
    };

    const addQuestionToChapter = (chapterIndex: number) => {
        // Make a shallow copy of the chapters array
        const newChapters = [...chapters];

        // Check if the chapter has a questions array, and if not, initialize it
        console.log(newChapters);
        console.log(chapterIndex);
        if (!newChapters[chapterIndex].questions) {
            newChapters[chapterIndex].questions = [''];
            newChapters[chapterIndex].answers = [''];// Initialize with an empty question if no questions exist
        } else {
            // Add an empty question to the chapter's questions array
            newChapters[chapterIndex].questions.push('');
            newChapters[chapterIndex].answers.push('');
        }

        // Update the state with the modified chapters array
        setChapters(newChapters);
    };

    const deleteQuestion = (chapterIndex: number, questionIndex: number) => {
        const newChapters = chapters.map((chapter, index) => {
            if (index == chapterIndex) {
                return {
                    ...chapter,
                    questions: chapter.questions.filter((_, qIndex) => qIndex !== questionIndex),
                    answers: chapter.answers.filter((_, qIndex) => qIndex !== questionIndex)
                };
            }
            return chapter;
        });
        setChapters(newChapters);
    };

    let activeChapterContent = chapters.find(chapter => chapter.chapterNumber === activeChapter);
    return (
        <div className="add-books-form">
            <h1>Edit Book</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Book Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-input"
                        placeholder="Untitled"
                    />
                </label>
                <label>
                    Book Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="form-input"
                    />
                </label>
                <label>
                    Book Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-textarea"
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    />
                </label>
                <label>
                    Number of Chapters:
                    <input
                        type="number"
                        value={numberOfChapters}
                        onChange={(e) => handleNumberOfChaptersChange(Number(e.target.value))}
                        className="form-input"
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    />
                </label>
                <div className="chapter-selector">
                    <select
                        value={activeChapter}
                        onChange={(e) => setExactChapter(Number(e.target.value))}
                        className="form-select"
                    >
                        {chapters.map((item, index) => (
                            <option key={index} value={item.chapterNumber}>
                                Chapter {item.chapterNumber}
                            </option>
                        ))}
                    </select>
                </div>
                {activeChapterContent && (
                    <div className="chapter-questions">
                        <h3>Chapter {activeChapterContent.chapterNumber}</h3>
                        {activeChapterContent.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="question-item">
                                <label>
                                    Question {questionIndex + 1}:
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) =>
                                            handleChapterQuestionChange(activeChapter - 1, e.target.value, questionIndex)
                                        }
                                        placeholder="Example"
                                        className="form-input"
                                    />
                                </label>
                                <label>
                                    Answer:
                                    <input
                                        type="text"
                                        value={activeChapterContent?.answers[questionIndex]}
                                        onChange={(e) =>
                                            handleChapterAnswerChange(activeChapter - 1, e.target.value, questionIndex)
                                        }
                                        placeholder="Example"
                                        className="form-input"
                                    />
                                </label>
                                <button type="button" onClick={() => deleteQuestion(activeChapter - 1, questionIndex)} className="delete-question">
                                    X
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addQuestionToChapter(activeChapter - 1)} className="add-question">
                            Add Question
                        </button>
                    </div>
                )}
                <button type="submit" className="save-button">Save</button>
            </form>
        </div>

    )
};

export default AddBooksForm;
