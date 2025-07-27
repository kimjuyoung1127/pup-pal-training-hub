video 1/1 (frame 331/332) C:\Users\gmdqn\AI\backend\uploads\1.avi: 640x384 1 dog, 63.7ms
video 1/1 (frame 332/332) C:\Users\gmdqn\AI\backend\uploads\1.avi: 640x384 1 dog, 59.9ms
Speed: 1.8ms preprocess, 62.7ms inference, 0.9ms postprocess per image at shape (1, 3, 640, 384)
Results saved to processed\results
INFO:main:계산된 지표: 안정성=91.61, 대칭성=93.09, 보폭=48.48
INFO:main:영상 처리 완료. 결과 URL: http://localhost:8000/processed/results/1.avi
INFO:httpx:HTTP Request: GET https://aqfforpyaqdjzcgjxcir.supabase.co/rest/v1/joint_analysis_records?select=id&dog_id=eq.bec2c820-5d5f-40f3-8168-8c8cdb3281f7&is_baseline=eq.True "HTTP/2 200 OK"
INFO:httpx:HTTP Request: POST https://aqfforpyaqdjzcgjxcir.supabase.co/rest/v1/joint_analysis_records "HTTP/2 201 Created"
INFO:main:DB 저장 성공. Record: [{'id': 2, 'user_id': 'e86e46ba-f0b3-4900-98c9-542638866f3b', 'dog_id': 'bec2c820-5d5f-40f3-8168-8c8cdb3281f7', 'created_at': '2025-07-27T05:38:39.127056+00:00', 'is_baseline': False, 'original_video_filename': '1.avi', 'processed_video_url': 'http://localhost:8000/processed/results/1.avi', 'analysis_results': {'symmetry': 93.09, 'stability': 91.61, 'stride_length': 48.48}, 'notes': None}]
INFO:     127.0.0.1:63193 - "POST /api/process-video HTTP/1.1" 200 OK
