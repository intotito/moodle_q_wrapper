package atu.moodle.question;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FormulaApplication {

	public static void main(String[] args) {
		var a = SpringApplication.run(FormulaApplication.class, args);
		// print list of app context
		for (var name : a.getBeanDefinitionNames()) {
//			System.out.println(":: -> :: " + name);
		}
	}

}
