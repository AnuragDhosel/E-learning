/*
2. Problem 2: Date Arithmetic Create a program that:
➢ Takes a date input and adds 7 days, 1 month, and 2 years to it.
➢ Then subtracts 3 weeks from the result.
Hint: Use LocalDate.plusDays(), plusMonths(), plusYears(), and
minusWeeks() methods.
 */

package Bridge_lab.cls8;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class q2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Step 1: Take date input from user
        System.out.print("Enter a date (dd-MM-yyyy): ");
        String inputDate = scanner.nextLine();

        // Step 2: Parse input string into LocalDate
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate date = LocalDate.parse(inputDate, formatter);

        // Step 3: Perform arithmetic operations
        LocalDate result = date.plusDays(7).plusMonths(1).plusYears(2).minusWeeks(3);

        // Step 4: Display the result
        System.out.println("Original Date: " + date.format(formatter));
        System.out.println("Final Date after operations: " + result.format(formatter));
    }
}
