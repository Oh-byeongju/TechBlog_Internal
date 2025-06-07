## **1. 프로젝트 개요**

### **1. 프로젝트 소개**
- Spring Boot와 Next.js를 활용하여 개발한 기술 블로그 미니 프로젝트입니다.
- 상황에 따라 Next.js의 다양한 렌더링 기법(SSR, CSR, SSG, ISR)을 적절히 활용하여 개발을 진행하였습니다.

<img width="100%" alt="Service" src="https://github.com/user-attachments/assets/34572a47-d028-42d3-b789-71bafbf0bd5c"/>

- **해당 프로젝트는 내부 사용자를 위한 서비스로**, 블로그 내의 모든 기능을 자유롭게 사용할 수 있도록 구성되어 있습니다.
    
<img width="100%" alt="Service" src="https://github.com/user-attachments/assets/3cc00bc4-dd96-4a04-a997-c10dc4eabe6f"/>
    
- 외부 사용자용 프로젝트 정보는 [링크](https://github.com/Oh-byeongju/TechBlog_External)를 참고해주세요.
### **2. 개발 기간**
- 2024.08.01 ~ 2024.12.31

## **2. 기술 및 도구**

### `Frontend`
- Node.js 20.9
- Next.js 14.2.5 (App Router)
- TypeScript
- Axios
- Recoil
- React Query
### `Backend`
- Java 11
- Spring Boot 2.7.3
- Spring Data JPA
- Spring Security
- PostgreSQL
- JWT
### `Library / API`
- OpenAI
- Milkdown Editor
- Unsplash
### `Design Tools`
- Figma
- Confluence
- ERDCloud
  
## **3. ERD 설계**

<img width="100%" alt="ERD" src="https://github.com/user-attachments/assets/1b6b2a81-91b5-479c-a7cd-f8b98c1b0650"/>

## **4. 시스템 아키텍처**

<img width="80%" alt="System" src="https://github.com/user-attachments/assets/19bd741a-e8a1-4788-96d5-a36a5dc29991"/>

&nbsp;&nbsp;

1. 사용자가 Web 또는 Mobile Web 환경(`Chrome`, `Edge` 등)에서 URL에 접속하면, 브라우저는 `Next.js` 기반 프론트엔드 서버로 요청을 보냅니다.
2. 프론트엔드 서버는 `Node.js` 런타임 위에서 작동하며, `TypeScript`와 `React` 기반의 `Next.js (App Router)`를 통해  HTML을 생성합니다. 이 과정에서 필요한 데이터는 Axios를 통해 백엔드 API로 요청됩니다.
3. 백엔드는 `Spring Boot` 서버로 구성되어 있으며, `Apache Tomcat`을 통해 HTTP 요청을 수신합니다. 프론트엔드에서 전달된 API 요청은 Spring MVC, Spring Security를 거쳐 처리됩니다.
4. 필요한 데이터는 `Spring Data JPA`를 통해 `PostgreSQL` 데이터베이스에서 조회되며, 비즈니스 로직에 따라 가공된 결과가 다시 프론트엔드로 전달됩니다.
5. 사용자의 요청 중 일부는 `OpenAI API`와 통신해야 할 수도 있습니다. 예를 들어, **GPT 기반의 텍스트 요약 또는 자동 생성 기능** 등이 이에 해당하며, 백엔드는 외부 `OpenAI` 서버에 HTTP 요청을 보내 응답을 받은 뒤 이를 프론트엔드에 반환합니다.

## 5. 사용자 요청 흐름

<div align="center">
  <img width="85%" alt="Flow" src="https://github.com/user-attachments/assets/7ce83aa4-32cd-45a6-87f0-85342663c919" />
</div>

1. 사용자의 모든 요청은 `Next.js 미들웨어`를 거칩니다.
2. 미들웨어에서는 쿠키에 저장된 JWT 토큰(`AccessToken`)을 읽어, `Authorization` 헤더에 추가합니다.
3. 이후, 백엔드(Spring Boot) API 서버로 **요청을 리다이렉트**하면서, 필요한 헤더 정보들을 함께 전달합니다.

```tsx
import {type NextRequest, NextResponse} from "next/server";

import {EJWT} from "@/types/enums/common-enum";

// 프록시 조건
export const config = {
  matcher: "/APICALL/:path*", // Match all requests under /APICALL
};

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(EJWT.AccessToken)?.value || '';

  const originalPathname = request.nextUrl.pathname;
  const newPathname = originalPathname.startsWith('/APICALL')
      ? originalPathname.substring('/APICALL'.length)
      : originalPathname;

  // 새로운 요청 헤더 설정
  const requestHeaders = new Headers(request.headers);

  // Authorization 헤더 추가
  if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  // API 주소로 프록시하면서 새로운 요청 헤더 설정
  return NextResponse.rewrite(
      new URL(`${process.env.NEXT_PUBLIC_REAL_SVR_BASE_URL}${newPathname}${request.nextUrl.search}`, request.url),
      {
          request: {
              headers: requestHeaders,
          },
      }
  );
}
```

## 추가로 구현할 내용