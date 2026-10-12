// Вставьте сюда ваш бесплатный API-ключ от GroqCloud или OpenAI
const API_KEY = 'ВАШ_API_КЛЮЧ'; 
// URL для Groq: https://api.groq.com/openai/v1/chat/completions
// URL для OpenAI/Proxy: https://api.openai.com/v1/chat/completions
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const generateRepairPlan = async (defectDescription, equipmentName) => {
    if (API_KEY === 'ВАШ_API_КЛЮЧ') {
        alert('Для работы ИИ необходимо вставить API-ключ в файл ai-planner.js');
        return null;
    }

    const prompt = `Ты главный инженер локомотивного депо. Составь краткий, пошаговый план ремонта (не более 5 пунктов) для узла "${equipmentName}". Проблема: "${defectDescription}". Пиши строго по делу.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Замените на gpt-3.5-turbo, если используете OpenAI
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 250
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        return 'Ошибка генерации плана. Проверьте соединение и API-ключ.';
    }
};
