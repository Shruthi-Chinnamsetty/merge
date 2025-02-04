-- Create the phrases table (if not exists)
CREATE TABLE IF NOT EXISTS phrases (
    id SERIAL PRIMARY KEY,
    language VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    phrase TEXT NOT NULL,
    translation TEXT NOT NULL
);

-- Insert comprehensive language data
INSERT INTO phrases (language, category, phrase, translation) VALUES
    -- Spanish
    ('spanish', 'Greetings', '¡Hola!', 'Hello'),
    ('spanish', 'Greetings', '¡Buenos días!', 'Good morning'),
    ('spanish', 'Basic', 'Gracias', 'Thank you'),
    ('spanish', 'Basic', 'Por favor', 'Please'),
    ('spanish', 'Emergency', '¿Dónde está el hospital?', 'Where is the hospital?'),
    
    -- Italian
    ('italian', 'Greetings', 'Ciao', 'Hello/Goodbye'),
    ('italian', 'Greetings', 'Buongiorno', 'Good morning'),
    ('italian', 'Basic', 'Grazie', 'Thank you'),
    ('italian', 'Basic', 'Per favore', 'Please'),
    ('italian', 'Emergency', 'Dov è l''ospedale?', 'Where is the hospital?'),
    
    -- French
    ('french', 'Greetings', 'Bonjour', 'Hello'),
    ('french', 'Greetings', 'Au revoir', 'Goodbye'),
    ('french', 'Basic', 'Merci', 'Thank you'),
    ('french', 'Basic', 'S''il vous plaît', 'Please'),
    ('french', 'Emergency', 'Où est l''hôpital?', 'Where is the hospital?'),
    
    -- German
    ('german', 'Greetings', 'Hallo', 'Hello'),
    ('german', 'Greetings', 'Auf Wiedersehen', 'Goodbye'),
    ('german', 'Basic', 'Danke', 'Thank you'),
    ('german', 'Basic', 'Bitte', 'Please'),
    ('german', 'Emergency', 'Wo ist das Krankenhaus?', 'Where is the hospital?'),
    
    -- Japanese
    ('japanese', 'Greetings', 'こんにちは (Konnichiwa)', 'Hello'),
    ('japanese', 'Greetings', 'さようなら (Sayounara)', 'Goodbye'),
    ('japanese', 'Basic', 'ありがとう (Arigatou)', 'Thank you'),
    ('japanese', 'Basic', 'お願いします (Onegaishimasu)', 'Please'),
    ('japanese', 'Emergency', '病院はどこですか (Byouin wa doko desu ka)?', 'Where is the hospital?'),
    
    -- Mandarin Chinese
    ('mandarin', 'Greetings', '你好 (Nǐ hǎo)', 'Hello'),
    ('mandarin', 'Greetings', '再见 (Zàijiàn)', 'Goodbye'),
    ('mandarin', 'Basic', '谢谢 (Xièxiè)', 'Thank you'),
    ('mandarin', 'Basic', '请 (Qǐng)', 'Please'),
    ('mandarin', 'Emergency', '医院在哪里 (Yīyuàn zài nǎlǐ)?', 'Where is the hospital?'),
    
    -- Korean
    ('korean', 'Greetings', '안녕하세요 (Annyeonghaseyo)', 'Hello'),
    ('korean', 'Greetings', '안녕히 가세요 (Annyeonghi gaseyo)', 'Goodbye'),
    ('korean', 'Basic', '감사합니다 (Gamsahamnida)', 'Thank you'),
    ('korean', 'Basic', '주세요 (Juseyo)', 'Please'),
    ('korean', 'Emergency', '병원이 어디입니까 (Byeongwoni eodiimnikka)?', 'Where is the hospital?'),
    
    -- Arabic
    ('arabic', 'Greetings', 'مرحبا (Marhaba)', 'Hello'),
    ('arabic', 'Greetings', 'مع السلامة (Ma''a as-salama)', 'Goodbye'),
    ('arabic', 'Basic', 'شكرا (Shukran)', 'Thank you'),
    ('arabic', 'Basic', 'من فضلك (Min fadlik)', 'Please'),
    ('arabic', 'Emergency', 'أين المستشفى؟ (Ayna al-mustashfa?)', 'Where is the hospital?'),
    
    -- Portuguese
    ('portuguese', 'Greetings', 'Olá', 'Hello'),
    ('portuguese', 'Greetings', 'Adeus', 'Goodbye'),
    ('portuguese', 'Basic', 'Obrigado/a', 'Thank you'),
    ('portuguese', 'Basic', 'Por favor', 'Please'),
    ('portuguese', 'Emergency', 'Onde fica o hospital?', 'Where is the hospital?'),
    
    -- Russian
    ('russian', 'Greetings', 'Здравствуйте (Zdravstvuyte)', 'Hello'),
    ('russian', 'Greetings', 'До свидания (Do svidaniya)', 'Goodbye'),
    ('russian', 'Basic', 'Спасибо (Spasibo)', 'Thank you'),
    ('russian', 'Basic', 'Пожалуйста (Pozhaluysta)', 'Please'),
    ('russian', 'Emergency', 'Где больница? (Gde bolnitsa?)', 'Where is the hospital?'),
    
    -- Hindi
    ('hindi', 'Greetings', 'नमस्ते (Namaste)', 'Hello'),
    ('hindi', 'Greetings', 'अलविदा (Alvida)', 'Goodbye'),
    ('hindi', 'Basic', 'धन्यवाद (Dhanyavaad)', 'Thank you'),
    ('hindi', 'Basic', 'कृपया (Kripya)', 'Please'),
    ('hindi', 'Emergency', 'अस्पताल कहाँ है? (Aspatal kahan hai?)', 'Where is the hospital?'),
    
    -- Thai
    ('thai', 'Greetings', 'สวัสดี (Sawadee)', 'Hello'),
    ('thai', 'Greetings', 'ลาก่อน (La gorn)', 'Goodbye'),
    ('thai', 'Basic', 'ขอบคุณ (Khob khun)', 'Thank you'),
    ('thai', 'Basic', 'กรุณา (Garunaa)', 'Please'),
    ('thai', 'Emergency', 'โรงพยาบาลอยู่ที่ไหน (Rong payaban yu tee nai?)', 'Where is the hospital?'),
    
    -- Vietnamese
    ('vietnamese', 'Greetings', 'Xin chào', 'Hello'),
    ('vietnamese', 'Greetings', 'Tạm biệt', 'Goodbye'),
    ('vietnamese', 'Basic', 'Cảm ơn', 'Thank you'),
    ('vietnamese', 'Basic', 'Làm ơn', 'Please'),
    ('vietnamese', 'Emergency', 'Bệnh viện ở đâu?', 'Where is the hospital?');

	SELECT * FROM phrases;
