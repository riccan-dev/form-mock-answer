package com.example.demo.domain.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.domain.dao.EsqUserDao;
import com.example.demo.domain.dto.LoginResponse;
import com.example.demo.domain.entity.EsqUser;

@Service
public class AuthServiceImpl implements AuthService {

	private final EsqUserDao esqUserDao;
	private final PasswordEncoder passwordEncoder;

	public AuthServiceImpl(EsqUserDao esqUserDao, PasswordEncoder passwordEncoder) {
		this.esqUserDao = esqUserDao;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public LoginResponse login(String esqId, String rawPassword) {
		EsqUser esqUser = esqUserDao.selectById(esqId);
		if (esqUser == null || !passwordEncoder.matches(rawPassword, esqUser.getPassword())) {
			return null;
		}
		return toResponse(esqUser);
	}

	@Override
	public LoginResponse currentUser(String esqId) {
		EsqUser esqUser = esqUserDao.selectById(esqId);
		return esqUser == null ? null : toResponse(esqUser);
	}

	private LoginResponse toResponse(EsqUser esqUser) {
		return LoginResponse.builder()
				.esqId(esqUser.getEsqId())
				.userName(esqUser.getUserName())
				.deptId(esqUser.getDeptId())
				.build();
	}
}
