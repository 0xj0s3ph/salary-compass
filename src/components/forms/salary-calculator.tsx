"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SalaryFormInputs } from "@/types";
import { FieldErrors } from "react-hook-form";

const salaryFormSchema = z
  .object({
    baseSalaryMin: z.number().min(0),
    baseSalaryMax: z.number().min(0),
    overtimeFixed: z.object({
      hours: z.number().min(0).max(80),
      amountMin: z.number().min(0),
      amountMax: z.number().min(0),
    }),
    overtimeAverage: z.object({
      hours: z.number().min(0).max(80),
      amountMin: z.number().min(0),
      amountMax: z.number().min(0),
    }),
    bonus: z.number().min(0),
  })
  .refine((data) => data.baseSalaryMin <= data.baseSalaryMax, {
    message: "最小給与は最大給与より小さくする必要があります",
    path: ["baseSalaryMin"],
  })
  .refine(
    (data) => data.overtimeFixed.amountMin <= data.overtimeFixed.amountMax,
    {
      message: "固定残業代の最小値は最大値より小さくする必要があります",
      path: ["overtimeFixed.amountMin"],
    },
  )
  .refine(
    (data) => data.overtimeAverage.amountMin <= data.overtimeAverage.amountMax,
    {
      message: "平均残業代の最小値は最大値より小さくする必要があります",
      path: ["overtimeAverage.amountMin"],
    },
  );

const SalaryCalculator = () => {
  const form = useForm<SalaryFormInputs>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      baseSalaryMin: 300000,
      baseSalaryMax: 500000,
      overtimeFixed: {
        hours: 20,
        amountMin: 60000,
        amountMax: 120000,
      },
      overtimeAverage: {
        hours: 10,
        amountMin: 45000,
        amountMax: 75000,
      },
      bonus: 500000,
    },
    mode: "onChange",
  });
  const {
    control,
    formState: { errors },
  } = form;

  // Watch all form fields for changes
  const formValues = useWatch({
    control,
    // No need to specify fields to watch all
  });

  const getAllErrorMessages = (
    errors: FieldErrors<SalaryFormInputs>,
  ): string[] => {
    const messages: string[] = [];

    Object.entries(errors).forEach(([, value]) => {
      if (typeof value === "object" && value !== null) {
        if ("message" in value && typeof value.message === "string") {
          messages.push(value.message);
        }
        messages.push(
          ...getAllErrorMessages(value as FieldErrors<SalaryFormInputs>),
        );
      }
    });

    return messages;
  };

  // Calculate all values whenever form changes
  const calculatedValues = useMemo(() => {
    if (!formValues)
      return {
        monthlyMin: 0,
        monthlyMax: 0,
        hourlyMin: 0,
        hourlyMax: 0,
        annualMin: 0,
        annualMax: 0,
        totalHours: 0,
      };

    const {
      baseSalaryMin,
      baseSalaryMax,
      overtimeFixed,
      overtimeAverage,
      bonus,
    } = formValues;

    // Calculate total work hours
    const baseWorkHours = 22.5 * 8; // Average working days * 8 hours
    const totalHours =
      baseWorkHours + (overtimeAverage?.hours || overtimeFixed?.hours || 0);

    // Calculate monthly salary
    const monthlyMin = (baseSalaryMin || 0) + (overtimeFixed?.amountMin || 0);
    const monthlyMax = (baseSalaryMax || 0) + (overtimeFixed?.amountMax || 0);

    // Calculate hourly rate
    const hourlyMin = totalHours > 0 ? monthlyMin / totalHours : 0;
    const hourlyMax = totalHours > 0 ? monthlyMax / totalHours : 0;

    // Calculate annual salary
    const annualMin = monthlyMin * 12 + (bonus || 0);
    const annualMax = monthlyMax * 12 + (bonus || 0);
    return {
      monthlyMin,
      monthlyMax,
      hourlyMin,
      hourlyMax,
      annualMin,
      annualMax,
      totalHours,
    };
  }, [formValues]);

  // Format numbers with commas and appropriate decimals
  // Format number to Japanese reading
  const getJapaneseNumber = (num: number): string => {
    if (!num) return "";
    const units = ["", "万", "億", "兆"];
    const parts = [];
    let n = Math.abs(num);
    let i = 0;

    while (n > 0 && i < units.length) {
      const part = n % 10000;
      if (part > 0) {
        parts.unshift(part + units[i]);
      }
      n = Math.floor(n / 10000);
      i++;
    }

    return parts.join("");
  };

  // Format for display with commas and optional decimals
  const formatCurrency = (amount: number, decimals: number = 0) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatRange = (min: number, max: number, decimals: number = 0) => {
    return `${formatCurrency(min, decimals)} 〜 ${formatCurrency(max, decimals)}`;
  };
  return (
    <Form {...form}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>給与計算機</CardTitle>
          <CardDescription>月給と時給を計算します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show all form errors at the top */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2">
              {getAllErrorMessages(errors).map((message, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
          <form className="space-y-6">
            <div className="grid gap-6">
              {/* 基本給 */}
              <div className="space-y-2">
                <Label>基本給</Label>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="baseSalaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          最小
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="例: 200,000"
                            onChange={(e) => {
                              // Remove non-digits and format
                              const rawValue = e.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              // Update form with number value
                              field.onChange(Number(rawValue));
                            }}
                            // Display formatted value with commas
                            value={
                              field.value ? field.value.toLocaleString() : ""
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {getJapaneseNumber(field.value)}円
                        </FormDescription>
                        {/* Individual field error */}
                        <FormMessage>
                          {errors.baseSalaryMin?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="baseSalaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          最大
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="例: 400,000"
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              field.onChange(Number(rawValue));
                            }}
                            value={
                              field.value ? field.value.toLocaleString() : ""
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {getJapaneseNumber(field.value)}円
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* 残業設定 */}
              <div className="space-y-2">
                <Label>残業設定</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Fixed Overtime Hours */}
                    <FormField
                      control={control}
                      name="overtimeFixed.hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            固定残業時間
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text" // Changed from "number" to "text"
                              placeholder="例: 20"
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /[^\d]/g,
                                  "",
                                );
                                field.onChange(Number(rawValue)); // Convert to number
                              }}
                              value={field.value || ""} // Handle the display value
                            />
                          </FormControl>
                          <FormDescription>月間固定時間</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Fixed Overtime Min Fee */}
                    <FormField
                      control={control}
                      name="overtimeFixed.amountMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            固定残業代（最小）
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="例: 30,000"
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /[^\d]/g,
                                  "",
                                );
                                field.onChange(Number(rawValue));
                              }}
                              value={
                                field.value ? field.value.toLocaleString() : ""
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {getJapaneseNumber(field.value)}円
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fixed Overtime Max Fee */}
                    <FormField
                      control={control}
                      name="overtimeFixed.amountMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            固定残業代（最大）
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="例: 50,000"
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /[^\d]/g,
                                  "",
                                );
                                field.onChange(Number(rawValue));
                              }}
                              value={
                                field.value ? field.value.toLocaleString() : ""
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {getJapaneseNumber(field.value)}円
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name="overtimeAverage.hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          平均残業時間
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text" // Changed from "number" to "text"
                            placeholder="例: 30"
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /[^\d]/g,
                                "",
                              );
                              field.onChange(Number(rawValue)); // Convert to number
                            }}
                            value={field.value || ""} // Handle the display value
                          />
                        </FormControl>
                        <FormDescription>月間平均時間</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* 賞与・年間 */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="bonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>賞与（年間）</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="例: 500,000"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(
                              /[^\d]/g,
                              "",
                            );
                            field.onChange(Number(rawValue));
                          }}
                          value={
                            field.value ? field.value.toLocaleString() : ""
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {getJapaneseNumber(field.value)}円
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>項目</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>月額給与 (基本給 + 残業代)</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRange(
                      calculatedValues.monthlyMin,
                      calculatedValues.monthlyMax,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    時給 (想定労働時間: 月
                    {calculatedValues.totalHours?.toFixed(1)}時間)
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRange(
                      calculatedValues.hourlyMin,
                      calculatedValues.hourlyMax,
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>年収 (賞与含む)</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRange(
                      calculatedValues.annualMin,
                      calculatedValues.annualMax,
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default SalaryCalculator;
