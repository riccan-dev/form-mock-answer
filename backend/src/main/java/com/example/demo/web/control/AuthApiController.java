package com.example.demo.web.control;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.dto.LoginRequest;
import com.example.demo.domain.dto.LoginResponse;
import com.example.demo.domain.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class AuthApiController {

	public static final String SESSION_KEY_ESQ_ID = "loginEsqId";

	/** ログイン中のesqIdをセッションから取得。未ログインならnull(呼び出し側で必須/任意を判断する)。 */
	public static String currentEsqId(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		return session == null ? null : (String) session.getAttribute(SESSION_KEY_ESQ_ID);
	}

	private final AuthService authService;

	public AuthApiController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
		LoginResponse response = authService.login(request.getEsqId(), request.getPassword());
		if (response == null) {
			return ResponseEntity.status(401).build();
		}
		httpRequest.getSession(true).setAttribute(SESSION_KEY_ESQ_ID, response.getEsqId());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
		HttpSession session = httpRequest.getSession(false);
		if (session != null) {
			session.invalidate();
		}
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/me")
	public ResponseEntity<LoginResponse> me(HttpServletRequest httpRequest) {
		String esqId = currentEsqId(httpRequest);
		LoginResponse response = esqId == null ? null : authService.currentUser(esqId);
		if (response == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(response);
	}
}
