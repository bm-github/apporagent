(function() {
    'use strict';
    
    console.log('\n' + '='.repeat(60));
    console.log('🧪 APP OR AGENT QUIZ - TEST SUITE LOADED');
    console.log('='.repeat(60) + '\n');
    
    const TestRunner = {
        results: [],
        
        resetQuiz: function(callback) {
            const container = document.getElementById('quiz-container');
            if (container) container.innerHTML = '';
            const header = document.querySelector('header');
            if (header) header.style.display = 'none';
            const modeSelection = document.getElementById('mode-selection');
            if (modeSelection) modeSelection.style.display = 'block';
            const loadMore = document.getElementById('load-more-container');
            if (loadMore) loadMore.style.display = 'none';
            score = 0;
            answered = 0;
            if (document.getElementById('score')) {
                document.getElementById('score').textContent = '0';
                document.getElementById('answered').textContent = '0';
                document.getElementById('progress-fill').style.width = '0%';
            }
            document.querySelectorAll('.celebration-message, .confetti').forEach(el => el.remove());
            setTimeout(() => { if (callback) callback(); }, 300);
        },
        
        recordResult: function(testName, passed, details = '') {
            this.results.push({ test: testName, passed: passed, details: details });
        },
        
        // Test 1: UI Elements
        testUIElements: function(callback) {
            console.log('\n🧪 TEST 1/6: UI Elements Check');
            console.log('-'.repeat(60));
            startQuiz(10);
            setTimeout(() => {
                const passed = document.querySelector('header').style.display !== 'none' &&
                               document.querySelectorAll('.quiz-card').length === 10;
                console.log(`  Header visible & 10 cards rendered: ${passed ? '✓' : '✗'}`);
                this.recordResult('UI Elements', passed);
                console.log(passed ? '✅ PASSED' : '❌ FAILED');
                setTimeout(() => this.resetQuiz(callback), 500);
            }, 500);
        },
        
        // Test 2: Quick Practice Mode
        testQuickPractice: function(callback) {
            console.log('\n🧪 TEST 2/6: Quick Practice (10 questions)');
            console.log('-'.repeat(60));
            startQuiz(10);
            setTimeout(() => {
                this.answerAllQuestions(10, () => {
                    const answeredCount = parseInt(document.getElementById('answered').textContent);
                    const passed = answeredCount === 10;
                    this.recordResult('Quick Practice', passed, `${answeredCount}/10 answered`);
                    console.log(passed ? '✅ PASSED' : '❌ FAILED');
                    setTimeout(() => this.resetQuiz(callback), 500);
                });
            }, 500);
        },
        
        // Test 3: Load More Button
        testLoadMore: function(callback) {
            console.log('\n🧪 TEST 3/6: Load More Button');
            console.log('-'.repeat(60));
            startQuiz(10);
            setTimeout(() => {
                this.answerAllQuestions(10, () => {
                    const loadMoreContainer = document.getElementById('load-more-container');
                    const isVisible = loadMoreContainer.style.display !== 'none';
                    if (isVisible) {
                        const beforeCount = document.querySelectorAll('.quiz-card').length;
                        document.getElementById('load-more-btn').click();
                        setTimeout(() => {
                            const afterCount = document.querySelectorAll('.quiz-card').length;
                            const buttonHidden = loadMoreContainer.style.display === 'none';
                            const expectedTotal = fullQuizData.length;
                            const countIsCorrect = afterCount === expectedTotal;
                            const passed = isVisible && countIsCorrect && buttonHidden;
                            this.recordResult('Load More', passed, `Expanded from ${beforeCount} to ${afterCount}/${expectedTotal}`);
                            console.log(`  Expanded to full quiz count: ${countIsCorrect ? '✓' : '✗'}`);
                            console.log(passed ? '✅ PASSED' : '❌ FAILED');
                            setTimeout(() => this.resetQuiz(callback), 500);
                        }, 1000);
                    } else {
                        this.recordResult('Load More', false, 'Button did not appear');
                        console.log('❌ FAILED');
                        setTimeout(() => this.resetQuiz(callback), 500);
                    }
                });
            }, 500);
        },

        // Test 4: Answer Mechanics
        testAnswerMechanics: function(callback) {
            console.log('\n🧪 TEST 4/6: Answer Button Mechanics');
            console.log('-'.repeat(60));
            startQuiz(10);
            setTimeout(() => {
                const firstCard = document.querySelector('.quiz-card');
                this.answerCardCorrectly(firstCard);
                setTimeout(() => {
                    const answeredCorrectly = firstCard.classList.contains('answered-correct') || firstCard.classList.contains('answered-tricky');
                    const answerVisible = firstCard.querySelector('.answer-section').classList.contains('visible');
                    const scoreIncremented = parseInt(document.getElementById('score').textContent) === 1;
                    const passed = answeredCorrectly && answerVisible && scoreIncremented;
                    this.recordResult('Answer Mechanics', passed);
                    console.log(`  Card answered and score updated: ${passed ? '✓' : '✗'}`);
                    console.log(passed ? '✅ PASSED' : '❌ FAILED');
                    setTimeout(() => this.resetQuiz(callback), 500);
                }, 500);
            }, 500);
        },

        // Test 5: Perfect Score (Quick)
        testPerfectScore: function(callback) {
            console.log('\n🧪 TEST 5/6: Perfect Score & Confetti (Quick)');
            console.log('-'.repeat(60));
            startQuiz(10);
            setTimeout(() => {
                this.answerAllCorrectly(() => {
                    const scoreVal = parseInt(document.getElementById('score').textContent);
                    const totalVal = parseInt(document.getElementById('total-count').textContent);
                    const confettiWorking = document.querySelectorAll('.confetti').length > 0;
                    const celebrationWorking = !!document.querySelector('.celebration-message');
                    const passed = scoreVal === totalVal && confettiWorking && celebrationWorking;
                    this.recordResult('Perfect Score (Quick)', passed, `Score: ${scoreVal}/${totalVal}`);
                    console.log(`  Perfect score and celebration triggered: ${passed ? '✓' : '✗'}`);
                    console.log(passed ? '✅ PASSED' : '❌ FAILED');
                    
                    // *** THIS IS THE CORRECTED LINE ***
                    this.resetQuiz(callback);
                });
            }, 500);
        },
        
        // Test 6: Full Quiz Journey
        testFullQuizJourney: function(callback) {
            console.log('\n🧪 TEST 6/6: Full Quiz Journey & Final Score');
            console.log('-'.repeat(60));
            
            startQuiz(10);
            
            setTimeout(() => {
                console.log('  > Answering first 10 questions...');
                this.answerAllCorrectly(() => {
                    console.log('  > Clicking "Load More"...');
                    document.getElementById('load-more-btn').click();
                    
                    setTimeout(() => {
                        console.log('  > Answering remaining questions...');
                        this.answerAllCorrectly(() => {
                            const scoreVal = parseInt(document.getElementById('score').textContent);
                            const totalVal = fullQuizData.length; // Uses the master data length for total
                            const confettiWorking = document.querySelectorAll('.confetti').length > 0;
                            const celebrationWorking = !!document.querySelector('.celebration-message');
                            const passed = scoreVal === totalVal && confettiWorking && celebrationWorking;
                            
                            console.log(`  Final score is perfect: ${scoreVal}/${totalVal} ${scoreVal === totalVal ? '✓' : '✗'}`);
                            console.log(`  Final celebration triggered: ${celebrationWorking ? '✓' : '✗'}`);
                            this.recordResult('Full Quiz Journey', passed, `Final Score: ${scoreVal}/${totalVal}`);
                            console.log(passed ? '✅ PASSED' : '❌ FAILED');
                            if (callback) callback();
                        });
                    }, 500);
                });
            }, 500);
        },
        
        // HELPER FUNCTIONS
        answerCardCorrectly: function(card) {
            const correctAnswer = card.dataset.answer;
            if (correctAnswer === 'tricky') {
                card.querySelector('.reveal-btn').click();
            } else {
                const correctButton = Array.from(card.querySelectorAll('.choice-btn')).find(btn => btn.textContent.toLowerCase().includes(correctAnswer));
                if (correctButton) correctButton.click();
            }
        },

        answerAllCorrectly: function(callback) {
            const cardsToAnswer = document.querySelectorAll('.quiz-card:not([class*="answered"])');
            if (cardsToAnswer.length === 0) {
                if(callback) callback();
                return;
            }
            cardsToAnswer.forEach((card, index) => {
                setTimeout(() => {
                    this.answerCardCorrectly(card);
                }, index * 100);
            });
            setTimeout(callback, (cardsToAnswer.length * 100) + 500);
        },

        answerAllQuestions: function(count, callback) {
            const cards = document.querySelectorAll('.quiz-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    const btn = card.querySelector('.choice-btn, .reveal-btn');
                    if (btn && !btn.disabled) btn.click();
                }, index * 50);
            });
            setTimeout(callback, (cards.length * 50) + 500);
        },
        
        printReport: function() {
            console.log('\n' + '='.repeat(60));
            console.log('📊 FINAL TEST REPORT');
            console.log('='.repeat(60) + '\n');
            let passedCount = 0;
            this.results.forEach((result, index) => {
                const icon = result.passed ? '✅' : '❌';
                const status = result.passed ? 'PASSED' : 'FAILED';
                console.log(`${icon} Test ${index + 1}: ${result.test} - ${status}`);
                if (result.details) console.log(`   ${result.details}`);
                if (result.passed) passedCount++;
            });
            console.log('\n' + '-'.repeat(60));
            console.log(`Summary: ${passedCount}/${this.results.length} tests passed`);
            if (passedCount === this.results.length) {
                console.log('🎉 ALL TESTS PASSED! 🎉');
            } else {
                console.log(`⚠️  ${this.results.length - passedCount} test(s) failed`);
            }
            console.log('='.repeat(60) + '\n');
        },
        
        runAll: function() {
            console.log('🚀 Running all tests in sequence...\n');
            this.results = [];
            this.testUIElements(() => {
                this.testQuickPractice(() => {
                    this.testLoadMore(() => {
                        this.testAnswerMechanics(() => {
                            this.testPerfectScore(() => {
                                this.testFullQuizJourney(() => {
                                    this.printReport();
                                    this.resetQuiz();
                                });
                            });
                        });
                    });
                });
            });
        }
    };
    
    window.TestRunner = TestRunner;
    
    console.log('📋 Test Suite Ready!\n');
    console.log('Run all tests automatically:');
    console.log('  → TestRunner.runAll()\n');
    console.log('Or run individual tests:');
    console.log('  → TestRunner.testUIElements()');
    console.log('  → TestRunner.testQuickPractice()');
    console.log('  → TestRunner.testLoadMore()');
    console.log('  → TestRunner.testAnswerMechanics()');
    console.log('  → TestRunner.testPerfectScore()\n');
    console.log('='.repeat(60) + '\n');
    
})();