import { FC } from "react";

export const LineChartIcon: FC<{ pathFill: string }> = ({ pathFill = "#6B7280" }) => {
    return (
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.6857 0.572854C11.7939 0.16068 12.209 -0.0839232 12.6129 0.0265187L17.4389 1.34627C17.6328 1.39931 17.7982 1.5288 17.8986 1.70626C17.999 1.88372 18.0262 2.09462 17.9742 2.29255L16.6811 7.21793C16.5729 7.63011 16.1578 7.87471 15.7539 7.76427C15.35 7.65383 15.1104 7.23016 15.2186 6.81799L16.0357 3.7058C13.7583 5.13791 11.8645 6.97205 10.3902 9.06553C10.2605 9.24963 10.0582 9.36633 9.83676 9.3847C9.61535 9.40306 9.3972 9.32125 9.24012 9.16094L6.05635 5.91159L1.29235 10.7737C0.99671 11.0754 0.517377 11.0754 0.221733 10.7737C-0.0739109 10.472 -0.0739109 9.98276 0.221733 9.68103L5.52104 4.27258C5.81668 3.97085 6.29601 3.97085 6.59166 4.27258L9.69412 7.43894C11.2092 5.46845 13.0851 3.73784 15.2915 2.35881L12.221 1.51914C11.8172 1.40869 11.5775 0.985029 11.6857 0.572854Z" fill={pathFill} />
      </svg>
    )
}