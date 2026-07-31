/**
 * Seeds the database with a starter aptitude question bank and coding
 * problem set so the app is usable immediately after setup.
 * Run with: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const AptitudeQuestion = require("../models/AptitudeQuestion");
const CodingProblem = require("../models/CodingProblem");

const aptitudeQuestions = [
  { category: "Quantitative", difficulty: "Easy", question: "A train travels 300 km in 5 hours. What is its speed?", options: ["50 km/h", "60 km/h", "45 km/h", "55 km/h"], correctOptionIndex: 1, explanation: "Speed = Distance / Time = 300/5 = 60 km/h" },
  { category: "Quantitative", difficulty: "Medium", question: "If the price of an item increases by 20% and then decreases by 20%, the net change is:", options: ["No change", "4% decrease", "4% increase", "2% decrease"], correctOptionIndex: 1, explanation: "Net change = -(20*20)/100 = -4%, a 4% decrease" },
  { category: "Quantitative", difficulty: "Medium", question: "What is the compound interest on ₹10,000 at 10% p.a. for 2 years?", options: ["₹2000", "₹2100", "₹2200", "₹1900"], correctOptionIndex: 1, explanation: "CI = 10000(1.1)^2 - 10000 = 2100" },
  { category: "Logical Reasoning", difficulty: "Easy", question: "Find the odd one out: Dog, Cat, Lion, Snake", options: ["Dog", "Cat", "Lion", "Snake"], correctOptionIndex: 3, explanation: "Snake is a reptile; the others are mammals" },
  { category: "Logical Reasoning", difficulty: "Medium", question: "If CODING is written as DPEJOH, how is FLOWER written?", options: ["GMPXFS", "GMPXFT", "GNQXFS", "GMQXFS"], correctOptionIndex: 0, explanation: "Each letter is shifted by +1 in the alphabet" },
  { category: "Logical Reasoning", difficulty: "Hard", question: "In a certain code, MONKEY is written as XPMLFZ. How is TIGER written?", options: ["SJHFS", "UJHFS", "UJHFT", "SJHFT"], correctOptionIndex: 1, explanation: "Pattern applies +1 shift to each letter" },
  { category: "Verbal Ability", difficulty: "Easy", question: "Choose the synonym of 'Abundant'", options: ["Scarce", "Plentiful", "Rare", "Limited"], correctOptionIndex: 1, explanation: "Abundant means existing in large quantities, i.e. plentiful" },
  { category: "Verbal Ability", difficulty: "Medium", question: "Choose the correctly spelled word", options: ["Occassion", "Ocassion", "Occasion", "Occasoin"], correctOptionIndex: 2, explanation: "'Occasion' is the correct spelling" },
  { category: "Verbal Ability", difficulty: "Medium", question: "Fill in the blank: She is ____ honest person.", options: ["a", "an", "the", "no article"], correctOptionIndex: 1, explanation: "'Honest' starts with a vowel sound, so 'an' is used" },
  { category: "Data Interpretation", difficulty: "Medium", question: "If a pie chart shows Sales=40%, Marketing=25%, R&D=20%, HR=15% of a ₹200,000 budget, what is the R&D budget?", options: ["₹30,000", "₹40,000", "₹50,000", "₹60,000"], correctOptionIndex: 1, explanation: "20% of 200,000 = 40,000" },
  { category: "Data Interpretation", difficulty: "Hard", question: "A bar chart shows monthly sales of 100, 120, 90, 150 units over 4 months. What is the average monthly sale?", options: ["110", "115", "112.5", "120"], correctOptionIndex: 1, explanation: "(100+120+90+150)/4 = 460/4 = 115" },
];

const codingProblems = [
  { title: "Two Sum", topic: "Arrays", difficulty: "Easy", description: "Given an array of integers, return indices of the two numbers that add up to a target.", link: "https://leetcode.com/problems/two-sum/" },
  { title: "Maximum Subarray", topic: "Arrays", difficulty: "Medium", description: "Find the contiguous subarray with the largest sum (Kadane's Algorithm).", link: "https://leetcode.com/problems/maximum-subarray/" },
  { title: "Valid Anagram", topic: "Strings", difficulty: "Easy", description: "Check whether two strings are anagrams of each other.", link: "https://leetcode.com/problems/valid-anagram/" },
  { title: "Longest Substring Without Repeating Characters", topic: "Strings", difficulty: "Medium", description: "Find the length of the longest substring without repeating characters.", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", description: "Reverse a singly linked list iteratively and recursively.", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { title: "Detect Cycle in Linked List", topic: "Linked List", difficulty: "Medium", description: "Determine if a linked list has a cycle using Floyd's algorithm.", link: "https://leetcode.com/problems/linked-list-cycle/" },
  { title: "Binary Tree Level Order Traversal", topic: "Trees & Graphs", difficulty: "Medium", description: "Return the level order traversal of a binary tree's node values.", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { title: "Number of Islands", topic: "Trees & Graphs", difficulty: "Medium", description: "Count the number of islands in a 2D grid using DFS/BFS.", link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", description: "Count distinct ways to climb n stairs taking 1 or 2 steps at a time.", link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "Longest Common Subsequence", topic: "Dynamic Programming", difficulty: "Hard", description: "Find the length of the longest common subsequence between two strings.", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { title: "Generate Parentheses", topic: "Recursion", difficulty: "Medium", description: "Generate all combinations of well-formed parentheses for n pairs.", link: "https://leetcode.com/problems/generate-parentheses/" },
  { title: "Merge Sort Implementation", topic: "Sorting & Searching", difficulty: "Medium", description: "Implement merge sort from scratch and analyze its time complexity.", link: "" },
  { title: "Binary Search", topic: "Sorting & Searching", difficulty: "Easy", description: "Implement binary search on a sorted array iteratively.", link: "https://leetcode.com/problems/binary-search/" },
];

const run = async () => {
  await connectDB();
  await AptitudeQuestion.deleteMany({});
  await CodingProblem.deleteMany({});
  await AptitudeQuestion.insertMany(aptitudeQuestions);
  await CodingProblem.insertMany(codingProblems);
  console.log(`Seeded ${aptitudeQuestions.length} aptitude questions and ${codingProblems.length} coding problems.`);
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
