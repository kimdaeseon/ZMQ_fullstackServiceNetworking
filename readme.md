# **[ ZMQ_fullstackServiceNetworking_sample](https://github.com/kimdaeseon/ZMQ_fullstackServiceNetworking_sample)**



## 0. 들어가기 전에

해당 코드들은 경희대학교 소프트웨어 융합학과 이성원 교수님의 python 예제 코드를 nodejs를 사용하여 구현한 코드들입니다.

## 1. 시작하기

node.js 의 zmq 에서는 최신 버전인 zmq 6.x와 구 버전인 zmq5.x가 존재합니다.

zmq를 사용함에 있어서

zmq 5.x는 이벤트식 비동기 처리로 메시지를 처리한다면

zmq 6.x는 promise와 async await을 사용하여 동기식으로 메시지를 처리합니다.

교수님의 예제코드가 zmq 6.x와 흡사한 부분이 많아 대부분 zmq 6.x 를 사용하여 구현하였으며 

11번 예제 코드의 경우만 zmq 5.x를 사용해 구현하였습니다.



Lecture_05_ZMQ_Source_Code 디렉토리에는 zmq 6.x 를 기반으로 예제 코드들이 구현되어있습니다.

lecture_05_ZMQ_Source_Cone_2 디렉토리에는 zmq 5.x를 기반으로 예제 코드들이 구현되어있습니다.



해당 디렉토리로 이동하신 후 아래 명령어를 실행합니다.

```javascript
npm install
```

필요한 모듈을 설치한 후 아래 명령어를 통해서 코드를 실행시켜 볼 수 있습니다.

```javascript
node '예제 파일 명'
```

## 2. 예제 개요

1, 2 : rep/req 패턴의 통신(1 : server, 2 : client)

3, 4 : pub/sub 패턴의 통신(3 : server, 4 : client)

5, 6 : push/pull, pub/sub 패턴의 통신(5 : server, 6 : client)

7, 8 : push/pull, pub/sub 패턴의 통신, 위의 예제 개선 (7 : server, 8 : client)

9, 10 : dealer/router 패턴의 통신, 멀티 쓰레드 server, (9 : server, 10 : client)

11 : 멀티 쓰레드로 client의 송신과 수신을 분리(zmq 5.x를 사용하여 송신과 수신을 비동기 적으로 수행) (9 : server, 11 : client)

12 : p2p 

## 3. 코드 위치

1~8, 10 번 예제는 Lecture_05_ZMQ_Source_Code 디렉토리에 존재합니다.

9 번 예제는 Lecture_05_ZMQ_Source_Code/lec-05-prg-09-dealer-router-async-server 디렉토리에 존재합니다.

10 번 예제는 Lecture_05_ZMQ_Source_Code/lec-05-prg-12-p2p-dechat 디렉토리에 존재합니다.

해당 예제들은 zmq 6.x를 기반으로 작성되었습니다.



11 번 예제는 lecture_05_ZMQ_Source_Cone_2 디렉토리에 존재하며

11 번 예제 전용 서버는 lecture_05_ZMQ_Source_Cone_2/lec-05-prg-09-dealer-router-async-server 디렉토리에 존재합니다.

추가로 lecture_05_ZMQ_Source_Cone_2 디렉토리에 5~8번 예제가 zmq 5.x로 구현된 코드가 존재합니다. 

